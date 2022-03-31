import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, createHttpLink,ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import App from "./App";

const httpLink = createHttpLink({
  uri: 'https://fathomless-mountain-10479.herokuapp.com/',
});

const authLink = setContext(()=>{
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}`: ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);