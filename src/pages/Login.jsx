import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles.css";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("elderly");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // =========================
  // NORMAL LOGIN
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    const loggedInUser = {
      email: data.user.email,
      name:
        data.user.user_metadata?.name ||
        data.user.email.split("@")[0],

      role: data.user.user_metadata?.role || role,
    };

    // Check selected role
    if (loggedInUser.role !== role) {
      setError("Incorrect role selected.");

      await supabase.auth.signOut();

      setLoading(false);
      return;
    }

    setLoading(false);

    onLogin(loggedInUser);
  };

  // =========================
  // FORGOT PASSWORD
  // =========================
  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    setForgotLoading(true);

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo:
            "http://localhost:5173/",
        }
      );

    setForgotLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage(
      "Password reset link has been sent to your email. Please check your inbox."
    );
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Digital Elderly Care</h1>

        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <label>Email Address</label>

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="Enter your email"
            required
          />

          {/* PASSWORD */}

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter your password"
            required
          />

          {/* FORGOT PASSWORD */}

          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={forgotLoading}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              padding: "8px 0",
              textAlign: "right",
              width: "100%",
            }}
          >
            {forgotLoading
              ? "Sending reset link..."
              : "Forgot Password?"}
          </button>

          {/* ROLE */}

          <label>Select Your Role</label>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setError("");
            }}
          >
            <option value="elderly">
              Elderly Person
            </option>

            <option value="helper">
              Local Helper
            </option>

            <option value="family">
              Family Member
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          {/* ERROR */}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* SUCCESS MESSAGE */}

          {message && (
            <p
              style={{
                color: "green",
                marginTop: "10px",
              }}
            >
              {message}
            </p>
          )}

          {/* LOGIN */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER */}

        <button
          type="button"
          className="login-button"
          onClick={onRegister}
        >
          Create New Account
        </button>

        <p>
          New user? Click above to register.
        </p>

        {/* DEMO LOGIN */}

        <div className="demo-login-info">

          <h3>Demo Login Details</h3>

          <p>
            <strong>Elderly:</strong>{" "}
            asha@gmail.com / Asha@123
          </p>

          <p>
            <strong>Helper:</strong>{" "}
            rajesh@gmail.com / Rajesh@123
          </p>

          <p>
            <strong>Family 1:</strong>{" "}
            priya@gmail.com / Priya@123
          </p>

          <p>
            <strong>Family 2:</strong>{" "}
            rahul@gmail.com / Rahul@123
          </p>

          <p>
            <strong>Admin:</strong>{" "}
            admin@gmail.com / Admin@123
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;