import { useState } from "react";
import HelperCard from "../components/HelperCard";

function LocalHelpers() {
  const [showForm, setShowForm] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState("");

  const [requestType, setRequestType] = useState("Medicine Pickup");
  const [description, setDescription] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [loading, setLoading] = useState(false);

  const openRequestForm = (helperName) => {
    setSelectedHelper(helperName);
    setShowForm(true);
  };

  const submitRequest = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const savedUser = localStorage.getItem("currentUser");

      if (!savedUser) {
        alert("Please login first.");
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch(
        "http://localhost:5000/api/help-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elderly_id: null,
            elderly_name: user.name,
            request_type: requestType,
            description: description,
            preferred_time: preferredTime,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create help request"
        );
      }

      alert(
        `✅ Help request sent successfully!\n\nHelper: ${selectedHelper}`
      );

      setShowForm(false);
      setDescription("");
      setPreferredTime("");
      setRequestType("Medicine Pickup");

    } catch (error) {
      console.error("Help Request Error:", error);
      alert("❌ Failed to send help request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      <div className="welcome-section">
        <h1>Local Helpers 👨‍⚕️</h1>
        <p>Find trusted helpers available near you.</p>
      </div>

      <div className="service-card">
        <h3>📍 Your Location</h3>
        <p>Showing helpers near your current area.</p>
      </div>

      <section className="helpers-section">

        <div className="section-header">
          <div>
            <h2>Available Helpers</h2>
            <p>Choose a helper for your needs.</p>
          </div>
        </div>

        <HelperCard
          name="Rajesh Kumar"
          rating="4.8"
          distance="1.2 km"
          available={true}
          onRequestHelp={openRequestForm}
        />

        <HelperCard
          name="Priya Sharma"
          rating="4.7"
          distance="2.1 km"
          available={true}
          onRequestHelp={openRequestForm}
        />

        <HelperCard
          name="Amit Verma"
          rating="4.5"
          distance="3.4 km"
          available={false}
          onRequestHelp={openRequestForm}
        />

      </section>

      {/* =============================== */}
      {/* REQUEST HELP FORM */}
      {/* =============================== */}

      {showForm && (
        <div className="service-card">

          <h2>📝 Request Help</h2>

          <p>
            Request help from{" "}
            <strong>{selectedHelper}</strong>
          </p>

          <form onSubmit={submitRequest}>

            <label>Type of Help</label>

            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option>Medicine Pickup</option>
              <option>Grocery Help</option>
              <option>Hospital Visit</option>
              <option>Household Help</option>
              <option>Accompany Me</option>
              <option>Other</option>
            </select>

            <label>Description</label>

            <textarea
              placeholder="Describe what help you need..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />

            <label>Preferred Time</label>

            <input
              type="text"
              placeholder="Example: Today 5:00 PM"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />

            <div style={{ marginTop: "15px" }}>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "📤 Send Help Request"}
              </button>

              <button
                type="button"
                className="request-button"
                onClick={() => setShowForm(false)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}

export default LocalHelpers;