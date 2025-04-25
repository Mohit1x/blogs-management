import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../../context/authContext";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
    
    <AuthProvider>
      <div>
     <div className="mb-20">
     <Navbar   />
     </div>
     <Component {...pageProps} />
    </div>
    </AuthProvider>
    </>
  );
}
