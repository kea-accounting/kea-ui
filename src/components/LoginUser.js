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

class CreateLogin extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    signinUser: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };

  state = {
    email: "",
    password: ""
  };

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
                placeholder="Username"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
                type="text"
                dir="auto"
              />
            </div>
          </div>
          <div className="pt-form-group">
            <label className="pt-label" for="password">
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
          <button
            type="button"
            disabled={!this.state.email || !this.state.password}
            onClick={this.signinUser}
            className="pt-button pt-intent-success pt-align-right"
          >
            Next step
            <span className="pt-icon-standard pt-icon-arrow-right pt-align-right" />
          </button>
        </form>
      </Aligner>
    );
  }

  signinUser = () => {
    const { email, password } = this.state;

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
  };
}

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

export default graphql(signinUser, { name: "signinUser" })(
  graphql(userQuery, { options: { fetchPolicy: "network-only" } })(
    withRouter(CreateLogin)
  )
);
