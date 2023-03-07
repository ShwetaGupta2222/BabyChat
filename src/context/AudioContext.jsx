import React,{ createContext ,useEffect,useState} from "react";
import { CallDialingSound,CallDisconnectSound,CallRingingSound,Typing} from '../audio'; 

export const AudioContext = React.createContext(null);
export const useAudio=()=>{
    return React.useContext(AudioContext)
}
export const AudioContextProvider =({children})=>{
    const audioDial = new Audio(CallDialingSound);
    const audioDisconnect = new Audio(CallDisconnectSound);
    const audioRing = new Audio(CallRingingSound);
    const audioTyping = new Audio(Typing)
    return(
    <AudioContext.Provider value={{audioDial,audioDisconnect,audioRing,audioTyping}}>
        {children}
    </AudioContext.Provider>
    )
}