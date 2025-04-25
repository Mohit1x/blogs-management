import React, { useEffect, useState } from 'react'
import ProfileLayout from '../layout'
import AuthorBlogs from '../blogs/page'

export default function Profile() {
     const [loggedIn, setLoggedIn] = useState<boolean>(false);
    
      useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          setLoggedIn(true);
        }
      }, []);
  return (
    <div>
      <ProfileLayout>
        <AuthorBlogs loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      </ProfileLayout>  
    </div>
  )
}

