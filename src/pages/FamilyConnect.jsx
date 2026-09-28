import { useEffect, useState } from "react";

function FamilyConnect({ user }) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyName, setFamilyName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Meeting states
  const [meetingFamilyName, setMeetingFamilyName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingRequests, setMeetingRequests] = useState([]);

  const API_URL = "https://digital-elderly-care.onrender.com";

  // =========================
  // LOAD FAMILY MEMBERS
  // =========================
  const loadFamilyMembers = async () => {
    if (!user?.name) {
      console.log("User not logged in");
      setFamilyMembers([]);
      return;
    }

    try {
      console.log("Logged-in user:", user);
      console.log("Searching family members for:", user.name);

      const response = await fetch(
        `${API_URL}/api/family-members/${encodeURIComponent(user.name)}`
      );

      const result = await response.json();

      console.log("Family members response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load family members"
        );
      }

      if (result.success) {
        setFamilyMembers(result.data || []);
      } else {
        setFamilyMembers([]);
      }
    } catch (error) {
      console.error("Error loading family members:", error);
      setFamilyMembers([]);
    }
  };

  // =========================
  // LOAD MEETING REQUESTS
  // =========================
  const loadMeetingRequests = async () => {
    if (!user?.name) {
      console.log("User not logged in");
      setMeetingRequests([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/meeting-requests/elderly/${encodeURIComponent(
          user.name
        )}`
      );

      const result = await response.json();

      console.log("Meeting requests response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load meeting requests"
        );
      }

      if (result.success) {
        setMeetingRequests(result.data || []);
      } else {
        setMeetingRequests([]);
      }
    } catch (error) {
      console.error("Error loading meeting requests:", error);
      setMeetingRequests([]);
    }
  };

  // =========================
  // LOAD DATA WHEN USER CHANGES
  // =========================
  useEffect(() => {
    if (user?.name) {
      loadFamilyMembers();
      loadMeetingRequests();
    } else {
      setFamilyMembers([]);
      setMeetingRequests([]);
    }
  }, [user?.name]);

  // =========================
  // ADD FAMILY MEMBER
  // =========================
  const addFamilyMember = async (e) => {
    e.preventDefault();

    if (!user?.name) {
      alert("Please login first.");
      return;
    }

    if (!familyName.trim()) {
      alert("Please enter family member name.");
      return;
    }

    if (!relation.trim()) {
      alert("Please enter relation.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/family-members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elderly_name: user.name,
            family_name: familyName.trim(),
            relation: relation.trim(),
            phone: phone.trim(),
          }),
        }
      );

      const result = await response.json();

      console.log("Add family member response:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to add family member"
        );
      }

      alert("✅ Family member added successfully!");

      setFamilyName("");
      setRelation("");
      setPhone("");

      await loadFamilyMembers();
    } catch (error) {
      console.error("Family Connect Error:", error);

      alert(
        `❌ Failed to add family member.\n\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE MEETING REQUEST
  // =========================
  const createMeetingRequest = async (e) => {
    e.preventDefault();

    if (!user?.name) {
      alert("Please login first.");
      return;
    }

    if (!meetingFamilyName) {
      alert("Please select a family member.");
      return;
    }

    try {
      setMeetingLoading(true);

      const response = await fetch(
        `${API_URL}/api/meeting-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elderly_name: user.name,
            family_name: meetingFamilyName,
            meeting_date: meetingDate,
            meeting_time: meetingTime,
            meeting_place: meetingPlace,
          }),
        }
      );

      const result = await response.json();

      console.log("Meeting request response:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to send meeting request"
        );
      }

      alert("📅 Meeting request sent successfully!");

      setMeetingFamilyName("");
      setMeetingDate("");
      setMeetingTime("");
      setMeetingPlace("");

      await loadMeetingRequests();
    } catch (error) {
      console.error("Meeting Request Error:", error);

      alert(
        `❌ Failed to send meeting request.\n\n${error.message}`
      );
    } finally {
      setMeetingLoading(false);
    }
  };

  // =========================
  // CANCEL MEETING REQUEST
  // =========================
  const cancelMeetingRequest = async (meetingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this meeting?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/meeting-requests/${meetingId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      console.log("Cancel meeting response:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to cancel meeting"
        );
      }

      alert("✅ Meeting cancelled successfully!");

      await loadMeetingRequests();
    } catch (error) {
      console.error("Cancel Meeting Error:", error);

      alert(
        `❌ Failed to cancel meeting.\n\n${error.message}`
      );
    }
  };

  return (
    <div className="dashboard">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="welcome-section">
        <h1>👨‍👩‍👧 Family Connect</h1>

        <p>
          Stay connected with your trusted family members.
        </p>
      </div>

      {/* =========================
          ADD FAMILY MEMBER
      ========================= */}
      <div className="service-card">

        <h2>➕ Add Family Member</h2>

        <form onSubmit={addFamilyMember}>

          <label>Family Member Name</label>

          <input
            type="text"
            placeholder="Enter family member name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            required
          />

          <label>Relation</label>

          <input
            type="text"
            placeholder="Example: Son, Daughter, Brother"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            required
          />

          <label>Phone Number</label>

          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "➕ Add Family Member"}
          </button>

        </form>

      </div>

      {/* =========================
          FAMILY MEMBERS LIST
      ========================= */}
      <div className="service-card">

        <h2>📞 My Family Members</h2>

        {familyMembers.length === 0 && (
          <p>No family members added yet.</p>
        )}

        {familyMembers.map((member) => (
          <div
            className="request-card"
            key={member.id}
          >

            <h3>{member.family_name}</h3>

            <p>
              <strong>Relation:</strong>{" "}
              {member.relation}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {member.phone}
            </p>

            <a href={`tel:${member.phone}`}>
              <button
                type="button"
                className="login-button"
              >
                📞 Call {member.family_name}
              </button>
            </a>

          </div>
        ))}

      </div>

      {/* =========================
          MEETING REQUEST FORM
      ========================= */}
      <div className="service-card">

        <h2>📅 Meet Family Member</h2>

        <form onSubmit={createMeetingRequest}>

          <label>Select Family Member</label>

          <select
            value={meetingFamilyName}
            onChange={(e) =>
              setMeetingFamilyName(e.target.value)
            }
            required
          >

            <option value="">
              Select family member
            </option>

            {familyMembers.map((member) => (
              <option
                key={member.id}
                value={member.family_name}
              >
                {member.family_name} - {member.relation}
              </option>
            ))}

          </select>

          <label>Meeting Date</label>

          <input
            type="date"
            value={meetingDate}
            onChange={(e) =>
              setMeetingDate(e.target.value)
            }
            min={new Date().toISOString().split("T")[0]}
            required
          />

          <label>Meeting Time</label>

          <input
            type="time"
            value={meetingTime}
            onChange={(e) =>
              setMeetingTime(e.target.value)
            }
            required
          />

          <label>Meeting Place</label>

          <input
            type="text"
            placeholder="Enter meeting place"
            value={meetingPlace}
            onChange={(e) =>
              setMeetingPlace(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="login-button"
            disabled={meetingLoading}
          >
            {meetingLoading
              ? "Sending..."
              : "📅 Request a Meeting"}
          </button>

        </form>

      </div>

      {/* =========================
          MEETING REQUESTS
      ========================= */}
      <div className="service-card">

        <h2>📋 My Meeting Requests</h2>

        {meetingRequests.length === 0 && (
          <p>No meeting requests yet.</p>
        )}

        {meetingRequests.map((meeting) => (
          <div
            className="request-card"
            key={meeting.id}
          >

            <h3>
              👨‍👩‍👧 {meeting.family_name}
            </h3>

            <p>
              <strong>Date:</strong>{" "}
              {meeting.meeting_date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {meeting.meeting_time}
            </p>

            <p>
              <strong>Place:</strong>{" "}
              {meeting.meeting_place}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span>{meeting.status}</span>
            </p>

            {meeting.status === "pending" && (
              <button
                type="button"
                className="login-button"
                onClick={() =>
                  cancelMeetingRequest(meeting.id)
                }
              >
                ❌ Cancel Meeting
              </button>
            )}

            {meeting.status === "accepted" && (
              <p>
                ✅ Your meeting has been accepted.
              </p>
            )}

            {meeting.status === "rejected" && (
              <p>
                ❌ Your meeting request was rejected.
              </p>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default FamilyConnect;
