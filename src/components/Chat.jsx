import React, { useCallback, useContext, useEffect, useState } from 'react'
import Arrow from '../img/arrow.png'
import Cross from "../img/cross.webp"
import {Messages,Input} from './'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../context/ChatContext'
import { IndexContext } from '../context/IndexContext'
import { arrayRemove, deleteDoc, deleteField, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'

const DeleteChat =({setMessage,handleDelete})=>{
  const {data}= useContext(ChatContext)
  const {currentUser} = useContext(AuthContext)
  const [display,setDisplay]=useState(false)
    console.log("clicked")
    console.log(currentUser,data)
    const handleClick =async(e)=>{
      e.preventDefault();
      setDisplay(!display); setTimeout(() => { handleDelete()}, 500);
       console.log(currentUser,data)
      try {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages:[]
          });
          await updateDoc(doc(db,"userChats",currentUser.uid),{
            [data.chatId +".lastMessage"] : deleteField()
          })
          await updateDoc(doc(db,"userChats",data.user.uid),{
            [data.chatId +".lastMessage"] : deleteField()
          })
          setMessage("Chat messages deleted successfully");
          setTimeout(() => {
            setMessage("")
          }, 2000);
        } catch (error) {
          setMessage("Error deleting chat messages: ");
          console.log("Error deleting chat messages: " + error.message);
        }
    }
    return(
     <div className={`change-profile ${display?"display":""} delete-account`}>
        <img className="cross" src={Cross} alt="" onClick={()=>{setDisplay(!display); setTimeout(() => { handleDelete()}, 500);}}/>
        <form onSubmit={handleClick}>
           <span className='span'>Do You really want to clear the chat?</span>
           <button>Clear Chat</button>
         </form>
     </div>
    )
}

const Chat=()=>{
  const [message, setMessage] = useState("");
  const [isDelete, setIsDelete] = useState(false)
  const {data}= useContext(ChatContext)
  const {currentUser} = useContext(AuthContext)
  const {val,dispatch1}= useContext(IndexContext)
  const navigate  = useNavigate() 
  const handleClick = () =>{
    dispatch1(false);
  }
  const handleDelete=()=>{
    setIsDelete(!isDelete);
    console.log(isDelete);
  }
  
  const handleVideoCallJoin=async()=>{
    try{
      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId +".videoCall"]:{
          inComing:true
        }
      })
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [data.chatId +".videoCall"]:{
            dialing:true
          }
      })
    }
    catch(err){
      console.log(err);
    }
  }
  
  return(
    <>
    {val && <div className="chat">
          <div className="chatInfo">
            {(data?.chatId!="null") && <>
            <div className="userInfo">
            <img className="img" src={Arrow} alt="" onClick={handleClick}/>
            <img className="profileImg" src={data?.user?.photoURL} alt=""/>
            <span>{data?.user?.displayName}</span>
            </div>
            <div className="chatIcons">
              {/* <div className='videoCall' onClick={handleVideoCallJoin} ></div>
              <div className='audioCall'></div> */}
              <div className='delete1' onClick={handleDelete}></div>
            </div>
            </>}
          </div>
          {message && <div className='chat-delete-confirmation'>{message}</div>}
         <Messages/>
         <Input/>
         {isDelete && <DeleteChat setMessage={setMessage} handleDelete={handleDelete}/>} 
    </div>}
    </>
  )
}

export default Chat