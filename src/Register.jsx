import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./styles.css";

function Register({ onRegisterSuccess, onBackToLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("elderly");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!/^[0-9]{10}$/.test(phone)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          name: name.trim(),
          phone: phone,
          role: role,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      setMessage(
        "Registration successful! You can now login."
      );

      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setRole("elderly");

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <p>Digital Elderly Care</p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, ""))
          }
          maxLength={10}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="elderly">Elderly</option>
          <option value="helper">Local Helper</option>
          <option value="family">Family Member</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>

        {message && <p>{message}</p>}

        <button
          type="button"
          onClick={onBackToLogin}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default Register;
