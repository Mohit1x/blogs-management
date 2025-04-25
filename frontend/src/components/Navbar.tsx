"use client"

import { useState, useEffect, useRef } from "react";

import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Icons
import { FiEdit } from "react-icons/fi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { PiSignOut } from "react-icons/pi";
import { Newspaper } from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/authContext";

const Navbar = () => {

    const router = useRouter();
    const {pathname} = router
    const { isLoggedIn, setIsLoggedIn,setCurrentUserId ,userRole} = useAuth();

    // const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string>('');
    const [isPopoverVisible, setPopoverVisible] = useState<boolean>(false)
    const [user, setUser] = useState<any>({});

    const [showPopup, setShowPopup] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const popOverRef = useRef<HTMLDivElement>(null);



    // Search Funcationality
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            setShowPopup(false);
            return;
        }

        const fetchSearchResults = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/blogs/search?query=${query}`);
                console.log("Data: ", data)
                setResults(data);

            } catch (error) {
                console.error("Search Error: ", error)
            }
        };

        const delayDebounceFn = setTimeout(fetchSearchResults, 500); // Add Debounce
        return () => clearTimeout(delayDebounceFn);
    }, [query]);


    useEffect(() => {
        if (query.trim() !== "" && results.length !== 0) {
            setShowPopup(true);
        } else {
            setShowPopup(false);
        }
    }, [query, results])


    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!query) return; // Don't navigate if empty

            router.push(`/search?q=${encodeURIComponent(query)}`);
            setQuery('')
        }
    }

    const handleSearchByIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!query) return;

        router.push(`/search?q=${encodeURIComponent(query)}`);
        setQuery('')
    }



    // Close PopOver when Click outside PopOver
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (popOverRef.current && !popOverRef.current.contains(event.target)) {
                setPopoverVisible(false);
            }
        };

        // Attach event listener
        window.addEventListener("click", handleClickOutside);

        return () => {
            // Cleanup event listener
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);


    const fetchLoggedInUser = async (userId: any) => {
        const id = typeof userId === 'object' ? userId._id : userId;
        const token = localStorage.getItem('accessToken');
        //  console.log(userId)
        if (!token) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/users/${id}`);

            if (response.data) {
                setUser(response.data);
                // console.log("User Data: ", response.data);
            }

            // Set profile image if available
            if (response.data.profileImage) {
                setProfileImage(`http://localhost:5000/uploads/${response.data.profileImage}`);
            }

        } catch (error) {

        }
    }


    const [token, setToken] = useState<string | null>(null);
  
    useEffect(() => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setToken(storedToken); 
      }
    }, []);
  
    useEffect(() => {
        const token = localStorage.getItem("accessToken"); // fetch token fresh on every render
    
        if (!token) {
          setIsLoggedIn(false);
          setCurrentUserId(null);
          return;
        }
    
        setIsLoggedIn(true);
    
        try {
          const decoded: any = jwtDecode(token);
          const userId = decoded?.id || decoded?._id;
    
          if (userId) {
            setCurrentUserId(userId);
            // You can also call fetchLoggedInUser(userId); if needed
            fetchLoggedInUser(userId)
          } else {
            console.error("❌ No user ID found in token");
          }
        } catch (error) {
          console.error("❌ Error decoding token:", error);
          setIsLoggedIn(false);
          setCurrentUserId(null);
        }
      }, []); 
    





    const handleWrite = () => {
        if (isLoggedIn) {
            router.push('/add-blog');
        } else {
            router.push('/login');
        }
    };

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId')
        setIsLoggedIn(false);
        setCurrentUserId(null);
        router.push('/login');
    };

    const handleProfileClick =(id:string)=>{
        console.log(id,"profileId")
        router.push(`/profile/${id}`)
        setPopoverVisible(false)
    }

    return (
        <>
            <div className="w-full bg-white fixed top-0 left-0 right-0 z-50 shadow px-8 py-4">
                <div className="flex justify-between items-center">

                    <div>
                        <button onClick={() => { window.location.reload() }} className="text-4xl font-medium uppercase">A<sub>9</sub> Blogs</button>
                    </div>

                    <div className="flex items-center justify-center space-x-10">

                        <button
                            onClick={() => router.push(`/`)}
                            className={`${pathname === '/' ? 'text-black text-xl' : 'text-gray-500 text-xl hover:text-black'}`}
                        >
                            Home
                        </button>

                        <button
                            onClick={() => router.push(`/blogs`)}
                            className={`${pathname === '/blogs' ? 'text-black text-xl' : 'text-gray-500 text-xl hover:text-black'}`}
                        >
                            Blogs
                        </button>

                       {userRole === "admin"? <button
                            onClick={handleWrite}
                            className={`${pathname === '/add-blog' ? 'flex items-center space-x-2 text-black' : 'flex items-center space-x-2 text-gray-500 hover:text-black'}`}
                        >
                            <FiEdit className="h-6 w-6" />
                            <span className="text-xl">Write</span>
                        </button>:null}

                        {/* Search Input */}
                        <div className={`${query ? 'border-2 border-black' : 'border-2 border-transparent'}   relative flex items-center bg-gray-100 pl-4 rounded-full`}>
                            <button onClick={handleSearchByIconClick}>
                                <HiMiniMagnifyingGlass className="h-7 w-7" />
                            </button>
                            <input
                                type="text"
                                placeholder="Search"
                                value={query}
                                onKeyDown={handleSearchKeyDown}
                                onChange={(e) => setQuery(e.target.value)}
                                className={`max-w-60 py-2.5 px-4 bg-inherit rounded-full outline-none placeholder-gray-500 text-lg`}
                            />

                            {showPopup && (
                                <div className="absolute left-0 top-14 min-w-[380px] min-h-fit bg-white rounded-xs shadow-lg border max-h-60 overflow-y-auto">
                                    <div className="p-2.5">
                                        <div className="px-2 mb-2">
                                            <h1 className="uppercase font-light text-xl text-black flex gap-x-2 items-center mb-2"><Newspaper />Blogs</h1>
                                            <hr className="border-b" />
                                        </div>
                                        {results.slice(0, 5).map((blog: any) => (
                                            <a target="_blank" href={`http://localhost:5000/blogs/${blog._id}.html`}>
                                                <div
                                                    key={blog._id}
                                                    className="flex h-full py-2 px-2 space-x-4 cursor-pointer hover:bg-gray-100 rounded-xs"
                                                >
                                                    <img src={`http://localhost:5000/uploads/${blog.image}`} alt={blog.title} className="h-16 w-28 object-cover aspect-[3/2] rounded-xs" />
                                                    <div className="flex flex-col items-start w-full">
                                                        <span className="text-sm font-medium line-clamp-2">{blog.title}</span>
                                                        <span className='text-xs mt-0.5'>
                                                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric"
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>


                        {isLoggedIn ? (
                            <div ref={popOverRef} className="relative h-12 w-12 flex items-center justify-center">
                                <button onClick={() => setPopoverVisible(!isPopoverVisible)}>
                                    <img
                                        src={profileImage}
                                        alt="profile"
                                        className="h-full w-full border rounded-md aspect-square object-cover object-top"

                                    />
                                </button>
                                {isPopoverVisible &&
                                    <div className="absolute min-w-80 -left-64 top-14 bg-white shadow px-4">
                                        <a onClick={() => handleProfileClick(user?._id)} className="w-full flex items-center justify-start px-4 space-x-3 text-gray-500 hover:text-gray-900">
                                            <FaRegUser className="h-5 w-5" />
                                            <span className="text-lg font-medium py-5">Profile</span>
                                        </a>
                                        <hr className="border" />
                                        <button onClick={() => { handleLogout(); setPopoverVisible(false) }} className="flex flex-col items-start py-4 px-4 group w-full">
                                            <h1 className="flex items-center text-lg font-medium text-red-500 mb-1.5"><PiSignOut className="h-6 w-6 mr-2" /> Sign Out</h1>
                                            <p className=" text-gray-500 group-hover:text-gray-900">{user?.email}</p>
                                        </button>
                                    </div>
                                }
                            </div>
                        )
                            : (
                                <>
                                    <button onClick={() => { router.push('/login') }} className="flex items-center space-x-2">
                                        <FaRegUser className="h-5 w-5" />
                                        <span className="text-gray-700">SignUp / SignIn</span>
                                    </button>
                                </>
                            )
                        }

                    </div>

                </div>
            </div >
        </>
    )
}

export default Navbar