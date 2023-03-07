import { onAuthStateChanged } from "firebase/auth";
import { createContext ,useEffect,useReducer,useState} from "react";
import { auth } from "../firebase";

export const IndexContext = createContext();

export const IndexContextProvider =({children})=>{
    const isActive = false;
    const indexReducer=(state,action)=>{
        if(action===false) return false;
        return true;
    }
    const [state,dispatch1] = useReducer(indexReducer,isActive)
    return(
    <IndexContext.Provider value={{val:state,dispatch1}}>
        {children}
    </IndexContext.Provider>
    )
}