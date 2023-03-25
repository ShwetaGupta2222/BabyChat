import { onSnapshot, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { IndexContext } from '../context/IndexContext';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
// import { useAudio } from '../context/AudioContext';
// import { CallDialingSound,CallDisconnectSound,CallRingingSound,Typing} from '../audio'; 

const VideoCall = ({ chat }) => {
          const navigate = useNavigate();
          const { currentUser } = useContext(AuthContext)
          const [visible, setvisible] = useState("")
          setTimeout(() => {
             setvisible('visible');
          }, 1000);
          
          const handleAccept = async () => {
            console.log("ACCepted by me ",currentUser.displayName)
            navigate(`/room/${chat[0]}`);
            await updateDoc(doc(db, "userChats", currentUser.uid), {
              [chat[0] + ".videoCall"]: {
                inComing: false
              }
            })
            await updateDoc(doc(db, "userChats", chat[1].userInfo.uid), {
              [chat[0] + ".videoCall"]: {
                accepted: true
              }
            })  
          }

          const handleDelete = async() => {
            try {
              await updateDoc(doc(db, "userChats", chat[1].userInfo.uid), {
                [chat[0] + ".videoCall"]: {
                  rejected: true
                }
              })
              await updateDoc(doc(db, "userChats", currentUser.uid), {
                [chat[0] + ".videoCall"]: {
                  inComing: false
                }
              })
            }
            catch (err) {
              console.log(err);
            }
          }
          return (
            <div className='video-container'>
            <div className='video-call-container'>
              <p className='call'>Incoming Video Call</p>
              <img src={chat[1]?.userInfo?.photoURL} alt="" />
              <p className='name'> {chat[1]?.userInfo?.displayName}</p>
              <div className={`buttons ${visible}`}>
                <button className='delete' onClick={handleDelete}></button>
                <button className='accept' onClick={handleAccept}></button>
              </div>
            </div>
            </div>
          );
}
const Dialing =({chat})=>{
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext)
  const [visible, setvisible] = useState("")
  useEffect(() => {
    setTimeout(() => {
      setvisible('visible');
    }, 1000);
  }, []);
  
  const handleDelete = async () => {
    await updateDoc(doc(db, "userChats", chat[1].userInfo.uid), {
      [chat[0] + ".videoCall"]: {
        inComing: false
      }
    })
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [chat[0] + ".videoCall"]:{
        dialing: false
      }
    })
  }
  
  return (
    <div className='video-container'>
      <div className='video-call-container'>
        <p className='call'>Dialing Video Call</p>
        <img src={chat[1]?.userInfo?.photoURL} alt="" />
        <p className='name'> {chat[1]?.userInfo?.displayName}</p>
        <div className={`buttons ${visible} dialing`}>
          <button className='delete2' onClick={() => handleDelete()}></button>
        </div>
      </div>
    </div>
  )
}
const Accepted = ({chat})=>{
        console.log("call Accepted by ",chat[1].userInfo.displayName)
        const navigate = useNavigate();
        const { currentUser } = useContext(AuthContext)
        const handleAccepted=async(chat)=>{
        try {
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [chat[0] + ".videoCall"]: {
              accepted: false
            }
          })}
          catch(err){
              console.log(err)
          } 
        }
        const handlenavigate=(chat)=>{
          navigate(`/room/${chat[0]}`); 
        }
        useEffect(()=>{
          handlenavigate(chat);
        },[handlenavigate])
        useEffect(() => {
          handleAccepted(chat);
        }, []);
        return (
          <></>
        )
}
const Rejected = ({chat})=>{
  const { currentUser } = useContext(AuthContext)
  const handleRejected=async(chat)=>{
    try{
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [chat[0] + ".videoCall"]: {
          rejected: false
        }
      })
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [chat[0] + ".videoCall"]: {
          dialing: false
        }
      })
    }
    catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => { 
      handleRejected(chat);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return(
    <div className='video-container '>
    <div className='video-call-container no-animation'>
      <p className='call'>Call declined</p>
      <img src={chat[1]?.userInfo?.photoURL} alt="" />
      <p className='name'> {chat[1]?.userInfo?.displayName}</p>
      <div className={`buttons visible dialing`}>
        <button className='delete'></button>
      </div>
     </div>
    </div>
    ) 
}

function Chats() {
  const [chats, setChats] = useState([])
  const [size, setSize] = useState(window.innerWidth);
  const { currentUser } = useContext(AuthContext)
  const { val, dispatch1 } = useContext(IndexContext)
  const { data, dispatch } = useContext(ChatContext)
  const [isDial, setIsDial] = useState(false)
  const [isDisconnect, setIsDisconnect] = useState(false)
  const [isRing, setIsRing] = useState(false)
  // const {audioDial,audioRing,audioDisconnect} = useAudio();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        return () => {
          unsub();
        }
      });
    }
    currentUser.uid && getChats()
  }, [currentUser.uid]);
 
  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  if ((size > 700) && (val === false)) { dispatch1(true); }
  if ((size <= 700) && (data.chatId === "null")) {
    dispatch1(false);}
  useEffect(() => {
    if ((size > 700) && (val === false)) { dispatch1(true); }
    if ((size <= 700) && (data.chatId === "null")) {
      dispatch1(false);
    }}, [size])
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u })
    dispatch1(true);
  }
  // useEffect(()=>{if(isDial){audioDial.play(); console.log("dial")}},[isDial])
//  console.log(currentUser)
  return (
    <div className="chats">
      {/* {chats && Object.entries(chats)} */}
      {chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(chat => {
        if (chat[1]?.userInfo?.uid === currentUser.uid) { return <></> }
        return (
          <div className='userChat' key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
            <div className='image'><img src={chat[1]?.userInfo?.photoURL} className="profileImg" alt=""/></div>
            <div className="userChatInfo">
              <span>{chat[1]?.userInfo?.displayName}</span>
              <p>{chat[1]?.lastMessage?.te}</p>
            </div>
            {chat[1]?.videoCall?.inComing && <VideoCall chat={chat}/> }
            {chat[1]?.videoCall?.accepted && <Accepted chat={chat}/>}
            {chat[1]?.videoCall?.rejected && <Rejected chat={chat}/>}
            {chat[1]?.videoCall?.dialing && <Dialing chat={chat}/>} 
          </div>)
      })}
    </div>
  );
}

export default Chats