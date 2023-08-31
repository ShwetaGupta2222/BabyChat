import React, { useContext, Component } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './style.scss';
import {Login, Register, Home} from './pages';
import { AuthContext } from './context/AuthContext';
import {Room} from './pages/Room';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log(error)
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  const {currentUser} = useContext(AuthContext);
  const ProtectedRoute = ({children})=>{
    if(!currentUser){
      return <Navigate to="/login"/>;
    }
    return children;
  }
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }/>
            <Route path='login' element={<Login />}/>
            <Route path='register' element={<Register />}/>
            <Route path=':roomIdroom/' element={<Room />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App;
