import { useContext, useEffect, useState } from 'react'
import { collection,getDoc, getDocs , doc,setDoc, query, where, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import {AuthContext} from "../context/AuthContext"

function Search() {
  const [username, setUsername] = useState("")
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)
  const [isTrue, setIsTrue] = useState(false)

  const {currentUser}=useContext(AuthContext)
 
  const handleSearch=async(e)=>{
    if(e.code=='enter' || true){
    const q = query(collection(db, "users"), where("displayName", "==", e.target.value)); 
    try{
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){setUsers([])}
      let setusers = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        setusers.push(doc.data())
      });
      console.log(setusers)
      setUsers(setusers) 
    }catch(err){
      setErr(true)
    }
  }
  };
  const handleSelect=async(user)=>{
      const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
      const d = new Date();
     try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: d
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: d
        });
      }
      } catch(err){
        setErr(true)
      }
      setUsers([])
      setUsername("")
  }
  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" placeholder='Find a user' value={username} onKeyDown={handleSearch} onChange={(e)=>{setUsername(e.target.value);}}/>
      </div>
      {username && (users.length===0) && <span>User not found!</span>}
      {users.map((user)=>{ 
        return(
        <div className='userChat' onClick={()=>{ setUser(user); return(handleSelect(user))}}>
        <img className="profileImg" src={user?.photoURL}/>
        <div className="userChatInfo">
          <span>{user?.displayName}</span>
        </div>
      </div>)})}
    </div>
  )
}

export default Search