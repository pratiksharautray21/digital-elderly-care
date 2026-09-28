
import { useEffect, useState } from "react";

function SOSButton({ user }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sosRequest, setSosRequest] = useState(null);

  const API_URL = "https://digital-elderly-care.onrender.com";

  // =========================
  // CHECK SOS STATUS
  // =========================
  useEffect(() => {
    if (!user?.name) return;

    const checkSOSStatus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/sos/elderly/${encodeURIComponent(
            user.name
          )}`
        );

        const result = await response.json();

        console.log("SOS STATUS:", result);

        if (response.ok && result.success && result.data) {
          setSosRequest(result.data);
          setSent(true);
        }
      } catch (error) {
        console.error("SOS Status Error:", error);
      }
    };

    checkSOSStatus();

    const interval = setInterval(
      checkSOSStatus,
      2000
    );

    return () => clearInterval(interval);
  }, [user?.name]);

  // =========================
  // SEND SOS
  // =========================
  const handleSOS = async () => {
    if (!user?.name) {
      alert("Please login first.");
      return;
    }

    const confirmSOS = window.confirm(
      "Are you sure you want to send an Emergency SOS?"
    );

    if (!confirmSOS) return;

    try {
      setLoading(true);

      console.log(
        "SENDING SOS FOR:",
        user.name
      );

      const response = await fetch(
        `${API_URL}/api/sos`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            elderly_id: user.id || null,
            elderly_name: user.name,
            type: "Emergency Help",
            message:
              "Elderly person needs immediate assistance.",
          }),
        }
      );

      const result = await response.json();

      console.log(
        "SOS RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to send SOS."
        );
      }

      setSosRequest(result.data);
      setSent(true);

      alert(
        `Emergency SOS sent successfully!\n\nElderly Person: ${user.name}`
      );
    } catch (error) {
      console.error(
        "SOS Error:",
        error
      );

      alert(
        "Failed to send SOS.\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sos-container">

      {/* SOS BUTTON */}
      <button
        className="sos-button"
        onClick={handleSOS}
        disabled={loading}
      >
        🚨

        <span>
          {loading
            ? "SENDING..."
            : "EMERGENCY HELP"}
        </span>

        <small>SOS</small>
      </button>


      {/* SOS STATUS */}
      {sent && sosRequest && (
        <div className="sos-success">

          <p>
            ✅ SOS Request Status:{" "}
            <strong>
              {sosRequest.status}
            </strong>
          </p>

          <p>
            <strong>
              Elderly Person:
            </strong>{" "}
            {sosRequest.elderly_name}
          </p>

          {sosRequest.status ===
            "pending" && (
            <p>
              ⏳ Waiting for a helper to
              accept your request.
            </p>
          )}

          {sosRequest.status ===
            "accepted" && (
            <p>
              👤 Helper Name:{" "}
              <strong>
                {sosRequest.helper_name ||
                  "Assigned"}
              </strong>
            </p>
          )}

        </div>
      )}

    </div>
  );
}

export default SOSButton;



