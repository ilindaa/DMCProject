import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './Router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  /*<React.StrictMode>*/ // Note: Strict mode renders twice (forms, etc.)
        <Router />
  /*</React.StrictMode>,*/
)
