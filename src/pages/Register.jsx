import {useEffect, useState} from 'react'
import Add from "../img/add.png"
import Check from "../img/check.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth,storage,db } from '../firebase';
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate} from 'react-router-dom';
import { CircularProgress } from '@mui/material';

function Register(){
  const [err, setErr] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit =async(e)=>{
      e.preventDefault();
      const displayName = e.target[0].value;
      const email = e.target[1].value;
      const password = e.target[2].value;
      const file = e.target[3]?.files[0];
      console.log(file)
      if(!file){
        setErr("Image is required!")
        setTimeout(() => {
          setErr("")
        }, 2000);
        return;
      }
      setLoading(true);
     try{    
       const res = await createUserWithEmailAndPassword(auth,email,password)
       const storageRef = ref(storage, email);

       await uploadBytesResumable(storageRef, file).then(() => {
            getDownloadURL(storageRef).then(async(downloadURL) => {
                try{
                await updateProfile(res.user,{
                  displayName,
                  photoURL:downloadURL,
                });
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName,
                  email,
                  photoURL: downloadURL,
                })
                await setDoc(doc(db, "userChats", res.user.uid), {});
                setErr("Successfully Registered")
                navigate("/")
                }
                catch(err){
                   setErr("Something went wrong!")
                   console.log(err)
                   setTimeout(() => {
                     setErr("")
                   }, 2000);
                }
              });
            });
            
          }
          catch(err){
            setErr("Something went wrong!")
                   console.log(err)
                   setTimeout(() => {
                     setErr("")
                   }, 2000);
          }
          setLoading(false);
  }
  return (
    <div className='formContainer'> 
      <div className='formWrapper'> 
          <span className='logo'>Baby Chat</span>
          <span className='title'>Register</span>
          <form onSubmit={handleSubmit}>
            <input type='text' required placeholder="display name"/>
            <input type='email' required placeholder="email"/>
            <input type='password' required placeholder="password"/>
            <input 
              style={{display:"none"}} 
              type='file' id="file" 
              accept="image/*"
              onChange={(e)=>{setPic(e.target?.value);
              }}/>
            <label htmlFor="file">
              {(pic=="") && <img src={Add} alt=""/>}
              {(pic!="") && <img src={Check} alt=""/>}
              <span style={{color:(pic!="")?'green':'blue',wordBreak:'break-all',position:'relative'}}>{(pic!="")?"Selected - "+pic:"Add an avtar"}</span>
            </label>
            {loading? <div className='button'>Sign Up</div>:<button>Sign Up</button>}
            {loading && <div><CircularProgress /></div>}
            <span>{err}</span>
          </form>
          <p>You do have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register