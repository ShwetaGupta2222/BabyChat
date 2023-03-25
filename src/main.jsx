import React from 'react'

import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthContextProvider } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext';
import { IndexContextProvider } from './context/IndexContext';
// import { AudioContextProvider } from './context/AudioContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <IndexContextProvider>
     <ChatContextProvider>
         {/* <AudioContextProvider> */}
              <React.StrictMode>
                  <App />
              </React.StrictMode>
         {/* </AudioContextProvider> */}
      </ChatContextProvider>
    </IndexContextProvider>
  </AuthContextProvider>
);
