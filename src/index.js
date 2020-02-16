import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { ApolloProvider } from '@apollo/react-hooks';
import * as serviceWorker from './serviceWorker';
import Routes from './routes';
import { createGlobalStyle } from "styled-components";

const httpLink = createHttpLink({ uri: 'http://localhost:8080/graphql' });

const middlewareLink = setContext(() => ({
  headers: {
    "x-token": localStorage.getItem("token"),
    "x-refresh-token": localStorage.getItem("refreshToken")
  }
}));

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const { response: { headers } } = operation.getContext();
    if (headers) {
      const token = headers.get("x-token");
      const refreshToken = headers.get("x-refresh-token");

      if (token) {
        localStorage.setItem("token", token);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }

    return response;
  });
});

const link = afterwareLink.concat(
  middlewareLink.concat(httpLink)
);

// const link = split(
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query);
//     return kind === "OperationDefinition" && operation === "subscription";
//   },
//   httpLinkWithMiddleware
// );

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  body {
    margin:0;
    font-family: 'Open Sans', sans-serif;
  }

`

const App = () => (
  <ApolloProvider client={client}>
    <GlobalStyles/>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
