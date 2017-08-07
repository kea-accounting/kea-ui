import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CreatePost from "./components/CreatePost";
import CreateUser from "./components/CreateUser";
import LoginUser from "./components/LoginUser";
import Nav from "./components/Nav";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";
import "./index.css";
import "@blueprintjs/core/dist/blueprint.css";

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
        <Nav />
        <Route path="/" component={App} />
        <Route path="/create" component={CreatePost} />
        <Route path="/login" component={LoginUser} />
        <Route path="/signup" component={CreateUser} />
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
