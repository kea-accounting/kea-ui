import React from "react";
import { graphql, gql } from "react-apollo";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, reduxForm, SubmissionError } from "redux-form";

const Aligner = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  height: 100%;
  justify-content: center;
`;

class CreateLogin extends React.Component {
  static propTypes = {
    signinUser: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
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
        <form onSubmit={this.props.handleSubmit(this.signinUser)}>
          {this.props.error && (
            <div className="pt-callout pt-intent-danger">
              <h5>Error</h5>
              {this.props.error}
            </div>
          )}
          <div className="pt-form-group">
            <label className="pt-label" htmlFor="username">
              Username
              <span className="pt-text-muted">(required)</span>
            </label>
            <div className="pt-form-content">
              <Field
                name="email"
                component="input"
                type="text"
                className="pt-input"
              />
            </div>
          </div>
          <div className="pt-form-group">
            <label className="pt-label" htmlFor="password">
              Password
              <span className="pt-text-muted">(required)</span>
            </label>
            <div className="pt-form-content">
              <Field
                name="password"
                component="input"
                type="password"
                className="pt-input"
              />
            </div>
          </div>
          <button
            type="submit"
            className="pt-button pt-intent-success pt-align-right"
          >
            Next step
            <span className="pt-icon-standard pt-icon-arrow-right pt-align-right" />
          </button>
        </form>
      </Aligner>
    );
  }

  signinUser = details => {
    const { email, password } = details;

    return this.props
      .signinUser({ variables: { email, password } })
      .then(response => {
        window.localStorage.setItem(
          "graphcoolToken",
          response.data.signinUser.token
        );
        this.props.history.replace("/");
        window.location.reload();
      })
      .catch(e => {
        console.error(e);
        throw new SubmissionError({ _error: e.message });
      });
  };
}

const LoginForm = reduxForm({
  form: "login"
})(CreateLogin);

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
  graphql(userQuery, { options: { fetchPolicy: "network-only" } })(LoginForm)
);
