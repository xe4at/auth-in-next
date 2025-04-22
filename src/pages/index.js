import Link from "next/link";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Our App</h1>
      <div className="home-buttons">
        <Link href="/singup" className="home-button">
          Create Account
        </Link>
        <Link href="/singin" className="home-button">
          Sign In
        </Link>
      </div>
    </div>
  );
}
