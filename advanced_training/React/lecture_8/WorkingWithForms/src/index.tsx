import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore CSS is loaded by the bundler; TypeScript has no declaration for it.
import './index.css';
import { App } from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
