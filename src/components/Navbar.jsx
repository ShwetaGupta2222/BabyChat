import { getAuth, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { auth, storage, db } from '../firebase';
import More from "../img/more.png"
import Add from "../img/add.png"
import Check from "../img/check.png"
import Cross from "../img/cross.webp"
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { ChatContext } from '../context/ChatContext';
import { IndexContext } from '../context/IndexContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const ChangeProfile = ({ currentUser, handleCross }) => {
  const [pic, setPic] = useState("")
  const [isChanged, setIsChanged] = useState(false)
  const [imgUrl, setImgUrl] = useState(currentUser.photoURL)
  const [display, setDisplay] = useState(false)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setIsChanged(false)
    if (selectedFile){
      setPic(selectedFile);
      setImgUrl(URL.createObjectURL(selectedFile));
    }
    else {
      setPic("");
      setImgUrl(currentUser.photoURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newImg = e.target[0]?.files[0];
    const storageRef = ref(storage, currentUser.email);
    try {
      await uploadBytesResumable(storageRef, newImg).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(currentUser, {
              photoURL: downloadURL,
            });
            await updateDoc(doc(db, "users", currentUser.uid), {
              photoURL: downloadURL,
            })
            const querySnapshot = await getDocs(collection(db, "userChats"));
            querySnapshot.forEach(async(doc1) => {
              if (doc1.id == currentUser.uid) return;
              const combinedId = currentUser.uid > doc1.id ? currentUser.uid + doc1.id : doc1.id + currentUser.uid;
              await updateDoc(doc(db,"userChats",doc1.id),{
                [combinedId +".userInfo.photoURL"]: downloadURL
              })
            })
              if(currentUser.photoURL===downloadURL){
                setIsChanged(true)
              }
           
          }catch (e) { console.log(e) }
        })
      });
    }catch(e) { console.log(e) }
  };

  return (
    <div className={`change-profile ${display ? "display" : ""}`}>
      <img className="profile" src={imgUrl} />
      <img className="cross" src={Cross} alt="" onClick={() => { setDisplay(!display); setTimeout(() => { handleCross() }, 500); }} />
      <form onSubmit={handleSubmit}>
        <input required
          style={{ display: "none" }}
          type='file' id="file"
          accept="image/*"
          onChange={handleFileChange}
        />x
        <label htmlFor="file">
          {(pic == "") && <img src={Add} alt="" />}
          {(pic != "") && <img src={Check} alt="" />}
          <span style={{ color: (pic != "") ? 'green' : 'blue', wordBreak: 'break-all', position: 'relative' }}>{(pic != "") ? "Selected" : "Select new Avtar"}</span>
        </label>
        <button style={{ backgroundColor: (isChanged != "") ? 'green' : '#7b96ec'}}>{isChanged?"Changed":"Save Changes"}</button>
      </form>
    </div>
  )
}
const ChangePassword = ({ currentUser, handleCross }) => {
  const [display, setDisplay] = useState(false)
  const [message,setMessage] = useState("");
  const [isChanged, setIsChanged] = useState(false)
  const [formData, setFormData] = useState({
    oldP: '',
    newP: '',
    confirmNewP: '',
  });
  const handleChange = (event) => {
    setIsChanged(false)
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit=async(e)=>{
    e.preventDefault(); 
    setIsChanged(false)
    setMessage("")
    console.log("clicked")
    const oldP = e.target[0].value;
    const newP = e.target[1].value;
    const confirmNewP = e.target[2].value;    
    try{
      await signInWithEmailAndPassword(auth, currentUser.email, oldP);
      if(newP===confirmNewP){
        const auth = getAuth();
        const user = auth.currentUser;
        updatePassword(user, newP).then(() => {
          setIsChanged(true)
          setFormData({
            oldP: '',
            newP: '',
            confirmNewP: '',
          });
        }).catch((error) => {
          setMessage("something went wrong!!")
          // console.log(error)
        });
      }
      else{
        setMessage("Confirm Password should be equal to New Password!!")
      }
    }
    catch(e){
      // console.log(e)
      setMessage("Old Password Not Matched!!")
    }
  }
  return (
    <div className={`change-profile ${display ? "display" : ""} change-password`}>
      <img className="cross" src={Cross} alt="" onClick={() => { setDisplay(!display); setTimeout(() => { handleCross() }, 500); }} />
      <form onSubmit={handleSubmit}>
        <input type="password" required placeholder="Old Password..." name="oldP" value={formData.oldP} onChange={handleChange} />
        <input type="password" required placeholder="New Password..." name="newP" value={formData.newP} onChange={handleChange} />
        <input type="password" required placeholder="Confirm New Password..." name="confirmNewP" value={formData.confirmNewP} onChange={handleChange} />
        {message && <span style={{color:"black"}}>{message}</span>}
        <button style={{ backgroundColor: (isChanged != "") ? 'green' : '#7b96ec'}}>{isChanged?"Changed":"Save Changes"}</button>
      </form>
    </div>
  )
}
const DeleteAccount = ({ currentUser, handleCross }) => {
  const [display, setDisplay] = useState(false)
  console.log("clicked")
  return (
    <div className={`change-profile ${display ? "display" : ""} delete-account`}>
      <img className="cross" src={Cross} alt="" onClick={() => { setDisplay(!display); setTimeout(() => { handleCross() }, 500); }} />
      <form >
        <span className='span'>Do You really want to delete your account Permanantly?</span>
        <button>Delete Account</button>
      </form>
    </div>
  )
}
function Navbar() {
  const { currentUser } = useContext(AuthContext)
  const [dropdownHover, setDropdownHover] = useState(false)
  const [dropdownLeave, setDropdownLeave] = useState(true)
  const [isChangeProfile, setIsChangeProfile] = useState(false)
  const [isChangePassword, setIsChangePassword] = useState(false)
  const [isDeleteAccount, setIsDeleteAccount] = useState(false)
  const { val, dispatch1 } = useContext(IndexContext)
  const { data, dispatch } = useContext(ChatContext)
  const handleCross = () => {
    setIsChangeProfile(false);
    setIsChangePassword(false);
    setIsDeleteAccount(false);
  }
  const handleClick = () => {
    setDropdownHover(!dropdownHover);
    setDropdownLeave(!dropdownLeave);
  }
  const changeProfile = () => {
    setIsChangeProfile(!isChangeProfile);
    setDropdownHover(!dropdownHover);
    setDropdownLeave(!dropdownLeave);
  }
  const changePassword = () => {
    setIsChangePassword(!isChangePassword);
    setDropdownHover(!dropdownHover);
    setDropdownLeave(!dropdownLeave);
  }
  const deleteAccount = () => {
    setIsDeleteAccount(!isDeleteAccount)
    setDropdownHover(!dropdownHover);
    setDropdownLeave(!dropdownLeave);
  }
  const handleLogOutClick = () => {
    dispatch({ type: "CHANGE_USER", payload: null })
    dispatch1(true);
    signOut(auth);
  }
  return (
    <div className="navbar">
      <span className="logo">Baby Chat</span>
      <div className='user'>
        <a href={currentUser?.photoURL} download><img className='image' src={currentUser?.photoURL} alt="img" /></a>
        <span>{currentUser?.displayName}</span>
        <button onClick={handleLogOutClick}>logout</button>
        <img className="more" src={More} onClick={handleClick} alt="" />
      </div>
      <div className={`dropdown ${dropdownHover ? "dropdown-hover" : ""} ${dropdownLeave ? "dropdown-leave" : ""}`}>
        <div onClick={changeProfile}>Change Profile</div>
        <div onClick={changePassword}>Change Password</div>
        <div onClick={deleteAccount}>Delete Account</div>
      </div>
      {isChangeProfile && <ChangeProfile currentUser={currentUser} handleCross={handleCross} />}
      {isChangePassword && <ChangePassword currentUser={currentUser} handleCross={handleCross} />}
      {isDeleteAccount && <DeleteAccount currentUser={currentUser} handleCross={handleCross} />}
    </div>
  )
}

export default Navbar