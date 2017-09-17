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

class CreateUser extends React.Component {
  static propTypes = {
    createUser: PropTypes.func.isRequired,
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
        <form onSubmit={this.props.handleSubmit(this.createUser)}>
          {this.props.error && (
            <div className="pt-callout pt-intent-danger">
              <h5>Error</h5>
              {this.props.error}
            </div>
          )}
          <div className="pt-form-group">
            <label className="pt-label" htmlFor="email">
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
          <div className="pt-form-group">
            <label className="pt-label" htmlFor="name">
              Name
              <span className="pt-text-muted">(required)</span>
            </label>
            <div className="pt-form-content">
              <Field
                name="name"
                component="input"
                type="text"
                className="pt-input"
              />
            </div>
          </div>
          <button
            className="pt-button pt-intent-success pt-align-right"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </Aligner>
    );
  }

  createUser = details => {
    const { email, password, name } = details;

    return this.props
      .createUser({
        variables: { email, password, name, emailSubscription: false }
      })
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
            throw new SubmissionError({ _error: e.message });
          });
      })
      .catch(e => {
        console.error(e);
        throw new SubmissionError({ _error: e.message });
      });
  };
}

const SignupForm = reduxForm({
  form: "login"
})(CreateUser);

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
    graphql(signinUser, { name: "signinUser" })(SignupForm)
  )
);
