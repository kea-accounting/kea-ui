import React from "react";
import ReactDOM from "react-dom";
import CreatePost from "./components/CreatePost";
import CreateUser from "./components/CreateUser";
import LoginUser from "./components/LoginUser";
import ListPage from "./components/ListPage";
import Nav from "./components/Nav";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { reducer as formReducer } from "redux-form";
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from "react-apollo";
import "./index.css";
import "@blueprintjs/core/dist/blueprint.css";
import "@blueprintjs/table/dist/table.css";
import styled from "styled-components";

const Container = styled.div`height: 100vh;`;

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

const store = createStore(
  combineReducers({
    form: formReducer,
    apollo: client.reducer()
  }),
  {}, // initial state
  compose(
    applyMiddleware(client.middleware()),
    // If you are using the devToolsExtension, you can add it here also
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

ReactDOM.render(
  <ApolloProvider client={client} store={store}>
    <Router>
      <Container>
        <Nav />
        <Route path="/create" component={CreatePost} />
        <Route path="/login" component={LoginUser} />
        <Route path="/signup" component={CreateUser} />
        <Route exact path="/" component={ListPage} />
      </Container>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
