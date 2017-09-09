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
        <form>
          <div className="pt-form-group">
            <label className="pt-label" for="username">
              Username
              <span className="pt-text-muted">(required)</span>
            </label>
            <div className="pt-form-content">
              <input
                id="username"
                className="pt-input"
                placeholder="Email"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
                type="text"
                dir="auto"
              />
            </div>
          </div>
          <div className="pt-form-group">
            <label className="pt-label" for="username">
              Password
              <span className="pt-text-muted">(required)</span>
            </label>
            <div className="pt-form-content">
              <input
                id="password"
                className="pt-input"
                placeholder="Password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
                type="text"
                dir="auto"
              />
            </div>
          </div>
          <div className="pt-form-group">
            <label className="pt-label" for="username">
              Name
              <span className="pt-text-muted">(required)</span>
            </label>
            <div className="pt-form-content">
              <input
                id="name"
                className="pt-input"
                placeholder="Name"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
                type="text"
                dir="auto"
              />
            </div>
          </div>
          <button
            className="pt-button pt-intent-success pt-align-right"
            disabled={!this.state.email || !this.state.password}
            onClick={this.createUser}
          >
            Sign Up
          </button>
        </form>
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
