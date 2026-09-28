import { useEffect, useState } from "react";

import { supabase } from "./supabaseClient";

import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Register from "./Register";

import Dashboard from "./pages/Dashboard";
import HelperDashboard from "./pages/HelperDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import FamilyConnect from "./pages/FamilyConnect";
import HealthLog from "./pages/HealthLog";

function App() {
  const [showRegister, setShowRegister] =
    useState(false);

  const [showResetPassword, setShowResetPassword] =
    useState(false);

  const [user, setUser] = useState(null);

  // =========================
  // CHECK PASSWORD RECOVERY
  // =========================

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setShowResetPassword(true);
          setUser(null);
          setShowRegister(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (loggedInUser) => {
    setShowResetPassword(false);
    setUser(loggedInUser);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setShowRegister(false);
    setShowResetPassword(false);
  };

  // =========================
  // RESET PASSWORD PAGE
  // =========================

  if (showResetPassword) {
    return (
      <ResetPassword
        onBackToLogin={() => {
          setShowResetPassword(false);
        }}
      />
    );
  }

  // =========================
  // LOGIN / REGISTER
  // =========================

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={() =>
            setShowRegister(false)
          }
          onBackToLogin={() =>
            setShowRegister(false)
          }
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() =>
          setShowRegister(true)
        }
      />
    );
  }

  // =========================
  // USER DASHBOARDS
  // =========================

  return (
    <div>

      {/* ELDERLY */}

      {user.role === "elderly" && (
        <>
          <Dashboard
            user={user}
            onLogout={handleLogout}
          />

          <HealthLog />

          <FamilyConnect user={user} />
        </>
      )}

      {/* HELPER */}

      {user.role === "helper" && (
        <HelperDashboard
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* FAMILY */}

      {user.role === "family" && (
        <FamilyDashboard
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* ADMIN */}

      {user.role === "admin" && (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}

export default App;