import React, { useContext, useEffect, useLayoutEffect, useRef ,useState} from 'react'
import {useParams} from "react-router-dom"
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export const Room = (props) => {
  // const [resp, setResp] = useState(true)
  const [instance, setInstance] = useState(null)
  const { currentUser } = useContext(AuthContext)
  const myMeeting = useRef(null);
  const {roomId} = useParams();
  const navigate = useNavigate();
  console.log(currentUser)
  useEffect(() =>{
    const joinMeeting = async () => {
      const appID = 90659147;   
      const serverSecret = "1d7e351d49cc525a185ec36b26b0166e";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, currentUser.uid, currentUser.displayName);

      const zc = ZegoUIKitPrebuilt.create(kitToken);
      console.log("initiqally",zc)
      if(zc)setInstance(zc);
      zc.joinRoom({
        container: myMeeting.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
        onLeaveRoom:"", 
      });
    };

    joinMeeting();
  }, [roomId, currentUser.uid, currentUser.displayName]);
  const handleRedButtonClick = () => {
     console.log("baby",instance)
     if (instance) {
      instance.destroy();
    }
     navigate('/');
    };
  return (
    <div className='room-container'>
       <div className="myCallContainer" ref={myMeeting}></div>
       <button onClick={handleRedButtonClick}></button>
    </div>
  )
}
