import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "./Contexts/AuthContext"
import { SocketProvider } from "./Contexts/socketContext"

/*solves the process error from the video chat*/
import * as process from 'process';

(window).global = window;
(window).process = process;
(window).Buffer = [];

/* wrap the main app with authprovider and socket provider so it can be used anywhere in teh application*/
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


