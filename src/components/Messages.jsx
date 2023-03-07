import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase'
import {Message} from './'

function Messages() {
  const [messages, setMessages] = useState([])
  const [previousDate,setPreviousDate]=useState("")
  const {data}= useContext(ChatContext)
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);
  
  const shouldDisplayDate = (index) => {
    if (index === 0) {
      return true;
    }
    const prevDate = new Date(messages[index - 1].date.toDate()).toLocaleDateString();
    const currDate = new Date(messages[index].date.toDate()).toLocaleDateString();
    return prevDate !== currDate;
  };

  return (
    <div className="messages">
      {data?.chatId === "null" && <span className="span">Start a new conversation here..</span>}
      {messages.map((message, i) => {
        return (
          <Message
            key={message.id}
            message={message}
            shouldDisplayDate={shouldDisplayDate(i)}
          />
        );
      })}
    </div>
  );
}

export default Messages