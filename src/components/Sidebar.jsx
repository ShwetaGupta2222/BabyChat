import React from 'react'
import {Navbar,Search,Chats} from './'

function sidebar() {
  return (
    <div className="sidebar">
      <Navbar/>
      <Search/>
      <Chats />
    </div>
  )
}

export default sidebar