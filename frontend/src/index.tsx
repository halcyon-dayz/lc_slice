import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {store} from "./features/store"
import App from './App';
import './index.css';
import "bootstrap/dist/css/bootstrap.css";
import { databaseClient } from './database/dbClient';
import { ApolloProvider } from '@apollo/client/react';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <ApolloProvider client={databaseClient}>
      <App />
    </ApolloProvider>
  </Provider>
);

