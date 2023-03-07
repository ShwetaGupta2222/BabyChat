import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import Spend from '../img/spend.png'
function Message({ message, shouldDisplayDate }) {
  const [time, setTime] = useState('');
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  useEffect(() => {
    const d = message.date.toDate();
    const h = (d.getHours() < 10 ? '0' : '') + d.getHours();
    const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    setTime(`${h}:${m}`);
  }, [message]);
  const Today = new Date().toLocaleDateString();
  const handleClick=(e)=>{
    console.log(e.target.src)
  } 
  return (
    <>
    {shouldDisplayDate && (
        <div className="messageDate">
          {message.date.toDate().toLocaleDateString()===Today?"Today":message.date.toDate().toLocaleDateString()}
        </div>
      )}
    <div ref={ref} className={`message ${message.senderId === currentUser.uid ? 'owner' : ''}`}>
      <div className="messageInfo">
        <img src={(message.senderId === currentUser.uid) ? currentUser.photoURL : data.user.photoURL} alt="" />
        <span>{time}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <a href={message.img} download><div className='msgImg'><img src={message.img} onClick={handleClick} alt="" /></div> </a>}
      </div>
    </div>
    </>
  )
}

export default Message