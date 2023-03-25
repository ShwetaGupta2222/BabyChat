import React, { useContext, useState } from 'react'
import Attach from '../img/attach.png'
import Img from '../img/img.png'
import Check from '../img/check.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { doc, updateDoc, arrayUnion,Timestamp, serverTimestamp } from "firebase/firestore";
import {v4 as uuid} from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { db, storage } from '../firebase'
function Input() {
  const [text, setText] = useState("")
  const [img, setImg] = useState(null)
  const [pic, setPic] = useState("");
  const [err, setErr] = useState(false)
  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  const handleSend = async()=>{
    setPic("");
    const te = text;
    const im = img;
    setText("")
    setImg(null)
    if(data.chatId==="null"){ return;}
    var d = new Date();
    const h = (d.getHours()<10?'0':'') + d.getHours();
    const m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    if((im!=null) && (te!="")){
        const storageRef = ref(storage, uuid());
        await uploadBytesResumable(storageRef, im).then(() => {
          getDownloadURL(storageRef).then(async(downloadURL) => {
              await updateDoc(doc(db,"chats",data.chatId),{
              messages: arrayUnion({
                id: uuid(),
                text:te,
                senderId: currentUser.uid,
                date: d,
                img: downloadURL,
              }),
            })
          })
        })
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [data.chatId +".lastMessage"]:{
            text:te
          },
          [data.chatId+".date"]:d
        })
        await updateDoc(doc(db,"userChats",data.user.uid),{
          [data.chatId +".lastMessage"]:{
            text:te
          },
          [data.chatId+".date"]:d
        })
      }
      else if(img){
        if(im!=null){
        const storageRef = ref(storage, uuid());
        await uploadBytesResumable(storageRef, im).then(() => {
          getDownloadURL(storageRef).then(async(downloadURL) => {
              await updateDoc(doc(db,"chats",data.chatId),{
              messages: arrayUnion({
                id: uuid(),
                senderId: currentUser.uid,
                date: d,
                img: downloadURL,
              }),
            })
          })
        })
      }
      }else{
        if(te!=""){
        await updateDoc(doc(db,"chats",data.chatId),{
          messages : arrayUnion({
            id: uuid(),
            text:te,
            senderId:currentUser.uid,
            date:d,
          })
        });
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [data.chatId +".lastMessage"]:{
            te
          },
          [data.chatId+".date"]:d
        })
        await updateDoc(doc(db,"userChats",data.user.uid),{
          [data.chatId +".lastMessage"]:{
            te
          },
          [data.chatId+".date"]:d
        })
      }
    }
  } 
  const handleKey=(e)=>{
    (e.code === "Enter") && (text!="") && handleSend() && setText("");
  }
  return (
    <div className="input">
      <input type="text" placeholder='Type something...' value={text} onKeyDown={handleKey} onChange={(e)=>{setText(e.target.value);}}/>
      <div className='send'>
          <img src={Attach} alt=""/>
          <input type="file" 
          accept="image/*"
          style={{display:"none"}}
           id="file" onChange={(e)=>{setPic(e.target.value); setImg(e.target.files[0])}}/>
          <label htmlFor='file'>
            {(pic=="") && <img src={Img} alt=""/>}
            {(pic!="") && <img src={Check} alt=""/>}
          </label>
          <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input