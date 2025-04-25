import Link from "next/link";

export default function Home() {
  const signOutHandler = async () => {
    const res = await fetch("/api/auth/singout");
    const data = await res.json();
    console.log(data);
  };
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Our App</h1>
      <div className="home-buttons">
        <Link href="/dashboard" className="home-button">
          <span>Dashboard</span>
        </Link>
        <Link href="/singup" className="home-button">
          <span>Create Account</span>
        </Link>
        <Link href="/singin" className="home-button">
          <span>Sign In</span>
        </Link>
        <button onClick={signOutHandler} className="home-button">
          Sign Out
        </button>
      </div>
    </div>
  );
}
