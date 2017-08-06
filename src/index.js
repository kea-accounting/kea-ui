import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CreatePost from "./containers/CreatePost";
import CreateUser from "./containers/CreateUser";
import LoginUser from "./containers/LoginUser";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";

const networkInterface = createNetworkInterface({
  uri: "https://api.graph.cool/simple/v1/cj60zjzb1jhfu0198t94wd7gr"
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }

      // get the authentication token from local storage if it exists
      if (localStorage.getItem("graphcoolToken")) {
        req.options.headers.authorization = `Bearer ${localStorage.getItem(
          "graphcoolToken"
        )}`;
      }
      next();
    }
  }
]);

const client = new ApolloClient({ networkInterface });

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path="/create" component={CreatePost} />
        <Route path="/login" component={LoginUser} />
        <Route path="/signup" component={CreateUser} />
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
