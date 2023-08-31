import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { CircularProgress } from '@mui/material';
function Login(){
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit =async(e)=>{
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
      setLoading(true)
     try{    
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/")
     } catch(err){
        setErr(true)
        console.log(err)
     }
     setLoading(false)
  }


  return (
    <div className='formContainer'> 
      <div className='formWrapper'> 
      <span className='logo'>Baby Chat</span>
          <span className='title'>Login</span>
            <form onSubmit={handleSubmit}>
              <input type='email' placeholder="email"/>
              <input type='password' placeholder="password"/>
              {loading? <div className='button'>Login</div>:<button>Login</button>}
              {loading &&  <div><CircularProgress /></div>}
              {err && <span>Something went Wrong!</span>}
            </form>
            <p>You don't have an account?<Link to='/register'>Register</Link></p>
      </div>
    </div>
  )
}

export default Login