import React from "react";
import { graphql, gql } from "react-apollo";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class Nav extends React.Component {
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
    if (this._isLoggedIn()) {
      return this.renderLoggedIn();
    } else {
      return this.renderLoggedOut();
    }
  }

  renderLoggedIn() {
    return (
      <nav className="pt-navbar .modifier">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">Kea</div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <button className="pt-button pt-minimal pt-icon-home">Home</button>
          <button className="pt-button pt-minimal pt-icon-document">
            Files
          </button>
          <span className="pt-navbar-divider" />
          <button className="pt-button pt-minimal pt-icon-user">
            {this.props.data.user.name}
          </button>
          <button className="pt-button pt-minimal pt-icon-notifications" />
          <button className="pt-button pt-minimal pt-icon-cog" />
          <button
            className="pt-button pt-minimal pt-icon-logout"
            onClick={this._logout}
          />
        </div>
      </nav>
    );
  }

  renderLoggedOut() {
    return (
      <nav className="pt-navbar .modifier">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">Kea</div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <Link to="/login" className="pt-button pt-minimal pt-icon-log-in">
            Log in
          </Link>
          <Link to="/signup" className="pt-button pt-minimal pt-icon-user">
            Sign up
          </Link>
        </div>
      </nav>
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
  Nav
);
