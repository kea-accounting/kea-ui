import React from "react";
import { withRouter } from "react-router";
import { graphql, gql } from "react-apollo";
import PropTypes from "prop-types";

class CreatePost extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    mutate: PropTypes.func,
    data: PropTypes.object
  };

  state = {
    description: "",
    imageUrl: ""
  };

  render() {
    if (this.props.data.loading) {
      return <div>Loading</div>;
    }

    // redirect if no user is logged in
    if (!this.props.data.user) {
      console.warn("only logged in users can create new posts");
      this.props.history.replace("/");
    }

    return (
      <div className="w-100 pa4 flex justify-center">
        <div style={{ maxWidth: 400 }} className="">
          <input
            className="w-100 pa3 mv2"
            value={this.state.description}
            placeholder="Description"
            onChange={e => this.setState({ description: e.target.value })}
          />
          <input
            className="w-100 pa3 mv2"
            value={this.state.imageUrl}
            placeholder="Image Url"
            onChange={e => this.setState({ imageUrl: e.target.value })}
          />
          {this.state.imageUrl &&
            <img src={this.state.imageUrl} alt="post" className="w-100 mv3" />}
          {this.state.description &&
            this.state.imageUrl &&
            <button
              className="pa3 bg-black-10 bn dim ttu pointer"
              onClick={this.handlePost}
            >
              Post
            </button>}
        </div>
      </div>
    );
  }

  handlePost = () => {
    const { description, imageUrl } = this.state;
    this.props.mutate({ variables: { description, imageUrl } }).then(() => {
      this.props.history.replace("/");
    });
  };
}

const createPost = gql`
  mutation($description: String!, $imageUrl: String!) {
    createPost(description: $description, imageUrl: $imageUrl) {
      id
    }
  }
`;

const userQuery = gql`
  query {
    user {
      id
    }
  }
`;

export default graphql(createPost)(
  graphql(userQuery, { options: { fetchPolicy: "network-only" } })(
    withRouter(CreatePost)
  )
);
