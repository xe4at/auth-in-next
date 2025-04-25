import { verifyToken } from "../../utils/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

function Dashboard({ result }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentLastName, setCurrentLastName] = useState("");

  useEffect(() => {
    // Fetch current user info when component mounts
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setCurrentName(data.data.name || "");
          setCurrentLastName(data.data.lastName || "");
        }
      });
  }, []);

  const submitHandler = async () => {
    const res = await fetch("/api/update-info", {
      method: "POST",
      body: JSON.stringify({ name, lastName, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.status === "success") {
      setCurrentName(name);
      setCurrentLastName(lastName);
      setName("");
      setLastName("");
      setPassword("");
    }
    console.log(data);
  };

  const signOutHandler = async () => {
    const res = await fetch("/api/auth/singout");
    const data = await res.json();
    if (data.status === "success") {
      router.reload();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <button className="dashboard-signout" onClick={signOutHandler}>
            Sign Out
          </button>
        </div>

        <div className="dashboard-info">
          <p>Your email is {result.email}</p>
          {currentName && currentLastName && (
            <p>
              Your current name: {currentName} {currentLastName}
            </p>
          )}
        </div>

        <div className="dashboard-form">
          <h3>Update your info:</h3>
          <div className="dashboard-input-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="dashboard-input-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="dashboard-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="dashboard-button" onClick={submitHandler}>
            Update
          </button>
        </div>
      </div>
    </div>
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
