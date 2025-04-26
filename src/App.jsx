import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './app/Home'
import CreatePost from './app/CreatePost'
import PostDetail from './app/PostDetail'
import EditPost from './app/EditPost'
import ProfileEdit from './app/ProfileEdit'
import ProfilePage from './app/ProfilePage'



const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/profile" element={<ProfilePage />} />  {/* 👈 View full profile */}

        <Route path="/profile/edit" element={<ProfileEdit />} />
       


      </Routes>
    </div>
  )
}

export default App
