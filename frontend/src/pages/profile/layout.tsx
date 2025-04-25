import { HeadHelper } from "@/components/HeadHelper"
import Profile from "@/components/ProfileSidebar"
import { useState } from "react"

const ProfileLayout=({children}:{children:React.ReactNode})=>{

    const [isFollowing,setIsFollowing] = useState(false)

    return(
       <>
           <HeadHelper title="A9Blos - profile" desc="profile page"/>
           <div className="max-w-7xl mx-auto px-0 h-screen">
                <div className="flex justify-center space-x-0 h-full sticky overflow-hidden">
                    <div className="w-1/3 border-r-2 pt-6">
                        <Profile isFollowing={isFollowing} setIsFollowing={setIsFollowing} />
                    </div>
            {children}
            </div>
        </div>
       </>
    )
}

export default ProfileLayout