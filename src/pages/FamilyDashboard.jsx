import { useEffect, useState } from "react";

function FamilyDashboard({ user, onLogout }) {
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(true);

  // =========================
  // LOAD MEETING REQUESTS
  // =========================
  const getFamilyNames = () => {
    const names = [];

    if (user?.name) names.push(user.name);
    if (user?.family_name) names.push(user.family_name);
    if (user?.fullName) names.push(user.fullName);
    if (user?.displayName) names.push(user.displayName);

    if (user?.name?.toLowerCase() === "rahul") {
      names.push("Rahul Sharma");
    }

    return [...new Set(names)];
  };

  const loadMeetingRequests = async () => {
    try {
      setLoading(true);
      const familyNames = getFamilyNames();
      let allRequests = [];

      for (const familyName of familyNames) {
        const response = await fetch(
          `http://localhost:5000/api/meeting-requests/family/${encodeURIComponent(
            familyName
          )}`
        );

        const result = await response.json();

        if (response.ok && result.success && result.data) {
          allRequests = [...allRequests, ...result.data];
        }
      }

      const uniqueRequests = Array.from(
        new Map(
          allRequests.map((request) => [request.id, request])
        ).values()
      );

      setMeetingRequests(uniqueRequests);
    } catch (error) {
      console.error("Error loading meeting requests:", error);
      setMeetingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD HEALTH LOGS OF ASHA
  // =========================
  const loadHealthLogs = async () => {
    try {
      setHealthLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/health-logs/asha"
      );

      const result = await response.json();

      console.log("Health Logs:", result);

      if (response.ok && result.success) {
        setHealthLogs(result.data || []);
      } else {
        setHealthLogs([]);
      }
    } catch (error) {
      console.error("Error loading health logs:", error);
      setHealthLogs([]);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    loadMeetingRequests();
    loadHealthLogs();

    const interval = setInterval(() => {
      loadMeetingRequests();
      loadHealthLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // =========================
  // ACCEPT REQUEST
  // =========================
  const acceptRequest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/meeting-requests/${id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Accept failed");
      }

      alert("Meeting request accepted!");
      await loadMeetingRequests();
    } catch (error) {
      console.error("Accept Error:", error);
      alert("Failed to accept request");
    }
  };

  // =========================
  // REJECT REQUEST
  // =========================
  const rejectRequest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/meeting-requests/${id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Reject failed");
      }

      alert("Meeting request rejected!");
      await loadMeetingRequests();
    } catch (error) {
      console.error("Reject Error:", error);
      alert("Failed to reject request");
    }
  };

  return (
    <div className="helper-dashboard">
      {/* NAVBAR */}
      <header className="navbar">
        <div>
          <h2>Digital Elderly Care</h2>
          <p>Family Member Dashboard</p>
        </div>

        <div>
          <span>👤 {user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <h1>Welcome, {user.name}</h1>

        <p>You are logged in as a Family Member.</p>

        <hr />

        {/* =========================
            HEALTH LOG SECTION
        ========================= */}
        <h2>❤️ Asha's Health Records</h2>

        {healthLoading && (
          <div className="request-card">
            <h3>Loading health records...</h3>
          </div>
        )}

        {!healthLoading && healthLogs.length === 0 && (
          <div className="request-card">
            <h3>No Health Records Found</h3>
            <p>Asha has not added any health records yet.</p>
          </div>
        )}

        {healthLogs.map((log) => (
          <div className="request-card" key={log.id}>
            <h3>🩺 Health Record</h3>

            <p>
              <strong>Elderly Person:</strong> {log.elderly_name}
            </p>

            <p>
              <strong>Blood Pressure:</strong>{" "}
              {log.blood_pressure || "Not available"}
            </p>

            <p>
              <strong>Heart Rate:</strong>{" "}
              {log.heart_rate || "Not available"}
            </p>

            <p>
              <strong>Temperature:</strong>{" "}
              {log.temperature || "Not available"}
            </p>

            <p>
              <strong>Blood Sugar:</strong>{" "}
              {log.blood_sugar || "Not available"}
            </p>

            <p>
              <strong>Medicines:</strong>{" "}
              {log.medicines || "Not available"}
            </p>

            <p>
              <strong>Doctor Visit:</strong>{" "}
              {log.doctor_visit || "Not available"}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {log.notes || "No notes"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {log.created_at
                ? new Date(log.created_at).toLocaleString()
                : "Not available"}
            </p>
          </div>
        ))}

        <hr />

        {/* =========================
            MEETING REQUESTS
        ========================= */}
        <h2>📅 Meeting Requests</h2>

        {loading && (
          <div className="request-card">
            <h3>Loading meeting requests...</h3>
          </div>
        )}

        {!loading && meetingRequests.length === 0 && (
          <div className="request-card">
            <h3>No Meeting Requests</h3>
            <p>New meeting requests will appear here.</p>
          </div>
        )}

        {meetingRequests.map((request) => (
          <div className="request-card" key={request.id}>
            <h3>📩 Meeting Request</h3>

            <p>
              <strong>Elderly Person:</strong>{" "}
              {request.elderly_name}
            </p>

            <p>
              <strong>Family Member:</strong>{" "}
              {request.family_name}
            </p>

            <p>
              <strong>Date:</strong> {request.meeting_date}
            </p>

            <p>
              <strong>Time:</strong> {request.meeting_time}
            </p>

            <p>
              <strong>Place:</strong> {request.meeting_place}
            </p>

            <p>
              <strong>Status:</strong> {request.status}
            </p>

            {request.status === "pending" && (
              <div>
                <button
                  onClick={() => acceptRequest(request.id)}
                  className="login-button"
                >
                  Accept
                </button>

                <button
                  onClick={() => rejectRequest(request.id)}
                  className="login-button"
                  style={{ marginLeft: "10px" }}
                >
                  Reject
                </button>
              </div>
            )}

            {request.status === "accepted" && (
              <p>✅ You accepted this meeting request.</p>
            )}

            {request.status === "rejected" && (
              <p>❌ You rejected this meeting request.</p>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

export default FamilyDashboard;