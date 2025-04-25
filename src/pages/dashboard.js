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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    lastName: "",
    password: "",
  });

  useEffect(() => {
    // Fetch current user info when component mounts
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setCurrentName(data.data.name || "");
          setCurrentLastName(data.data.lastName || "");
        } else {
          setError(data.message || "Failed to fetch user data");
        }
      })
      .catch((err) => {
        setError("Failed to fetch user data. Please try again later.");
      });
  }, []);

  const submitHandler = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
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
        setSuccess("Your information has been updated successfully!");
        setFieldErrors({});
      } else {
        setError(
          data.message || "Failed to update information. Please try again."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (name && name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
      isValid = false;
    }

    if (lastName && lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters long";
      isValid = false;
    }

    if (password && password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const signOutHandler = async () => {
    try {
      const res = await fetch("/api/auth/singout");
      const data = await res.json();
      if (data.status === "success") {
        router.push("/");
      } else {
        setError("Failed to sign out. Please try again.");
      }
    } catch (err) {
      setError("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {currentName && currentLastName
              ? `Welcome, ${currentName} ${currentLastName}!`
              : "Welcome to Your Dashboard"}
          </h1>
          <button className="dashboard-signout" onClick={signOutHandler}>
            Sign Out
          </button>
        </div>

        {error && <div className="dashboard-error">{error}</div>}
        {success && <div className="dashboard-success">{success}</div>}

        <div className="dashboard-info">
          <p>Your email is {result.email}</p>
          {!currentName && !currentLastName && (
            <p className="dashboard-warning">
              Please complete your profile by adding your name and last name.
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
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors({ ...fieldErrors, name: "" });
              }}
              className={fieldErrors.name ? "dashboard-input-error" : ""}
            />
            {fieldErrors.name && (
              <span className="dashboard-error-message">
                {fieldErrors.name}
              </span>
            )}
          </div>
          <div className="dashboard-input-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setFieldErrors({ ...fieldErrors, lastName: "" });
              }}
              className={fieldErrors.lastName ? "dashboard-input-error" : ""}
            />
            {fieldErrors.lastName && (
              <span className="dashboard-error-message">
                {fieldErrors.lastName}
              </span>
            )}
          </div>
          <div className="dashboard-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors({ ...fieldErrors, password: "" });
              }}
              className={fieldErrors.password ? "dashboard-input-error" : ""}
            />
            {fieldErrors.password && (
              <span className="dashboard-error-message">
                {fieldErrors.password}
              </span>
            )}
          </div>
          <button
            className="dashboard-button"
            onClick={submitHandler}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
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

  // Only pass the email to the component
  return {
    props: {
      result: {
        email: result.email,
      },
    },
  };
}
