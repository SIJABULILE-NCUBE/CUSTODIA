// this is the file that actually mounts my app onto the page

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
