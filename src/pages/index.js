import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") setIsLoggedIn(true);
      });
  }, []);

  const signOutHandler = async () => {
    const res = await fetch("/api/auth/singout");
    const data = await res.json();
    if (data.status == "success") {
      router.reload();
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Our App</h1>

      <div className="home-buttons">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="home-button">
              <span>Dashboard</span>
            </Link>
            <button onClick={signOutHandler} className="home-button signout">
              <span>Sign Out</span>
            </button>
          </>
        ) : null}

        {!isLoggedIn ? (
          <>
            <Link href="/singup" className="home-button">
              <span>Create Account</span>
            </Link>
            <Link href="/singin" className="home-button">
              <span>Sign In</span>
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
