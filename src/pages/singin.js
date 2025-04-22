import { useRouter } from "next/router";
import { useState } from "react";

function SingIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const singinHandler = async () => {
    const res = await fetch("/api/auth/singin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.status === "success") router.push("/dashboard");
  };

  return (
    <div>
      <h3>Login Form </h3>
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
      <button onClick={singinHandler}>Login</button>
    </div>
  );
}

export default SingIn;
