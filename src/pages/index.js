import Link from "next/link";

export default function Home() {
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
      </div>
    </div>
  );
}
