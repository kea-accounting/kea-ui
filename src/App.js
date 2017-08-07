import React from "react";
import { graphql, gql } from "react-apollo";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import ListPage from "./components/ListPage";
import NewPostLink from "./components/NewPostLink";
import PropTypes from "prop-types";

class App extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  _logout = () => {
    // remove token from local storage and reload page to reset apollo client
    window.localStorage.removeItem("graphcoolToken");
    window.location.reload();
  };

  _isLoggedIn = () => {
    return this.props.data.user;
  };

  render() {
    if (this.props.data.loading) {
      return <div>Loading</div>;
    }

    if (this._isLoggedIn()) {
      return this.renderLoggedIn();
    } else {
      return this.renderLoggedOut();
    }
  }

  renderLoggedIn() {
    return (
      <div>
        <span>
          Logged in as {this.props.data.user.name}
        </span>
        <div className="pv3">
          <span
            className="dib bg-red white pa3 pointer dim"
            onClick={this._logout}
          >
            Logout
          </span>
        </div>
        <ListPage />
        <NewPostLink />
      </div>
    );
  }

  renderLoggedOut() {
    return (
      <div>
        <div className="pv3">
          <div>
            <Link to="/login" className="dib pa3 white bg-blue dim pointer">
              Log in with Email
            </Link>
          </div>
          <span>Log in to create new posts</span>
          <div>
            <Link to="/signup" className="dib pa3 white bg-blue dim pointer">
              Sign up with Email
            </Link>
          </div>
        </div>
        <ListPage />
      </div>
    );
  }
}

const userQuery = gql`
  query {
    user {
      id
      name
    }
  }
`;

export default graphql(userQuery, { options: { fetchPolicy: "network-only" } })(
  withRouter(App)
);
