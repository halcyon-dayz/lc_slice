import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {store} from "./features/store"
import App from './App';
import reportWebVitals from './reportWebVitals';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();