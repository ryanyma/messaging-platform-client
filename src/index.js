import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloLink, split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';
import * as serviceWorker from './serviceWorker';
import Routes from './routes';
import { createGlobalStyle } from 'styled-components';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import createFileLink from './createFileLink';

const httpLink = createFileLink({ uri: 'http://localhost:8080/graphql' });

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken'),
  },
}));

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const {
      response: { headers },
    } = operation.getContext();
    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');

      if (token) {
        localStorage.setItem('token', token);
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }

    return response;
  });
});

const linkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink));

// Create a WebSocket link:
export const wsLink = new WebSocketLink({
  uri: `ws://localhost:8080/subscriptions`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: {
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
    },
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  linkWithMiddleware
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  html, body, #root {
    margin:0;
    font-family: Catamaran, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-weight: 500;
    background-color: #F7F8FB;
  }

`;

const App = () => (
  <ApolloProvider client={client}>
    <GlobalStyles />
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
