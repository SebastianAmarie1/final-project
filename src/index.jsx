import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "./Contexts/AuthContext"
import { SocketProvider } from "./Contexts/socketContext"

/*solves the process error*/
import * as process from 'process';

(window).global = window;
(window).process = process;
(window).Buffer = [];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </React.StrictMode>
);


