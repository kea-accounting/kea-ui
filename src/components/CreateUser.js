import React from "react";
import { withRouter } from "react-router";
import { graphql, gql } from "react-apollo";
import PropTypes from "prop-types";
import styled from "styled-components";

const Aligner = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
`;

class CreateUser extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
    signinUser: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };

  constructor(props) {
    super();

    this.state = {
      email: "",
      password: "",
      name: "",
      emailSubscription: false
    };
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading</div>;
    }

    // redirect if user is logged in
    if (this.props.data.user) {
      console.warn("already logged in");
      this.props.history.replace("/");
    }

    return (
      <Aligner>
        <div style={{ maxWidth: 400 }} className="">
          <input
            className="w-100 pa3 mv2"
            value={this.state.email}
            placeholder="Email"
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input
            className="w-100 pa3 mv2"
            type="password"
            value={this.state.password}
            placeholder="Password"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <input
            className="w-100 pa3 mv2"
            value={this.state.name}
            placeholder="Name"
            onChange={e => this.setState({ name: e.target.value })}
          />
          <div>
            <input
              className="w-100 pa3 mv2"
              value={this.state.emailSubscription}
              type="checkbox"
              onChange={e =>
                this.setState({ emailSubscription: e.target.checked })}
            />
            <span>Subscribe to email notifications?</span>
          </div>

          {this.state.name &&
          this.state.email &&
          this.state.password && (
            <button
              className="pa3 bg-black-10 bn dim ttu pointer"
              onClick={this.createUser}
            >
              Log innn
            </button>
          )}
        </div>
      </Aligner>
    );
  }

  createUser = () => {
    const { email, password, name, emailSubscription } = this.state;

    this.props
      .createUser({ variables: { email, password, name, emailSubscription } })
      .then(response => {
        this.props
          .signinUser({ variables: { email, password } })
          .then(response => {
            window.localStorage.setItem(
              "graphcoolToken",
              response.data.signinUser.token
            );
            this.props.history.replace("/");
          })
          .catch(e => {
            console.error(e);
            this.props.history.replace("/");
          });
      })
      .catch(e => {
        console.error(e);
        this.props.history.replace("/");
      });
  };
}

const createUser = gql`
  mutation(
    $email: String!
    $password: String!
    $name: String!
    $emailSubscription: Boolean!
  ) {
    createUser(
      authProvider: { email: { email: $email, password: $password } }
      name: $name
      emailSubscription: $emailSubscription
    ) {
      id
    }
  }
`;

const signinUser = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
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

export default graphql(createUser, { name: "createUser" })(
  graphql(userQuery, { options: { fetchPolicy: "network-only" } })(
    graphql(signinUser, { name: "signinUser" })(withRouter(CreateUser))
  )
);
