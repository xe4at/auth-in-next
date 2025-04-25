import { verifyToken } from "../../utils/auth";
import { useState } from "react";

function Dashboard({ result }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async () => {
    const res = await fetch("/api/update-info", {
      method: "POST",
      body: JSON.stringify({ name, lastName, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <p>Your email is {result.email}</p>
        <h3>Update your info:</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={submitHandler}>Update</button>
      </div>
    </>
  );
}

export default Dashboard;

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  const secretKey = process.env.SECRET_KEY;

  const result = verifyToken(token, secretKey);

  if (!result)
    return {
      redirect: { destination: "/singin", permanent: false },
    };

  return { props: { result } };
}
