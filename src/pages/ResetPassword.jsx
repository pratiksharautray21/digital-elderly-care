import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles.css";

function ResetPassword({ onBackToLogin }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    // Check password length
    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    // Check matching passwords
    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const { error: updateError } =
      await supabase.auth.updateUser({
        password: password,
      });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(
      "Password updated successfully. You can now login."
    );

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Reset Password</h1>

        <p>
          Create a new password for your account.
        </p>

        <form onSubmit={handleUpdatePassword}>

          {/* NEW PASSWORD */}

          <label>New Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="Enter new password"
            minLength={6}
            required
          />

          {/* CONFIRM PASSWORD */}

          <label>Confirm Password</label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(
                e.target.value
              );

              setError("");
              setMessage("");
            }}
            placeholder="Confirm new password"
            minLength={6}
            required
          />

          {/* ERROR */}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* SUCCESS */}

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

          {/* UPDATE BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Updating Password..."
              : "Update Password"}
          </button>

        </form>

        {/* BACK TO LOGIN */}

        {message && (
          <button
            type="button"
            className="login-button"
            onClick={onBackToLogin}
            style={{
              marginTop: "10px",
            }}
          >
            Back to Login
          </button>
        )}

      </div>

    </div>
  );
}

export default ResetPassword;