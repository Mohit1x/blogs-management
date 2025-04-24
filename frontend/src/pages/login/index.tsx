import { useEffect, useState } from "react";
import LoginComponent from "@/components/auth/LoginComponent";

const LoginPage = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <LoginComponent setLoggedIn={setLoggedIn} />
    </div>
  );
};

export default LoginPage;
