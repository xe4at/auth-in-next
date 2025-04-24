import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function SingUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

    useEffect(() => {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") router.replace("/dashboard");
        });
    }, []);
  

  const singupHandler = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch("/api/auth/singup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.status === "success") {
        router.push("/singin");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h3>Create Account</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        <button onClick={singupHandler} disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default SingUp;
