import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
 
   useEffect(() => {
     const token = localStorage.getItem("accessToken");
     if (token) {
       setLoggedIn(true);
     }
   }, []);  

  return (
    <div>
     <div className="mb-20">
     <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn}  />
     </div>
     <Component {...pageProps} />
    </div>
  );
}
