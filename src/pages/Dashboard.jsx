
import { useEffect, useState } from "react";
import SOSButton from "../components/SOSButton";
import HelperCard from "../components/HelperCard";
import RequestCard from "../components/RequestCard";

function Dashboard({ user }) {
  const API_URL = "https://digital-elderly-care.onrender.com";

  // =========================
  // HELP REQUEST FORM
  // =========================
  const [showForm, setShowForm] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState("");

  const [requestType, setRequestType] =
    useState("Medicine Pickup");

  const [description, setDescription] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // NORMAL HELP REQUESTS
  // =========================
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] =
    useState(true);

  // =========================
  // SOS STATUS
  // =========================
  const [sosRequest, setSosRequest] = useState(null);
  const [sosLoading, setSosLoading] = useState(true);

  // =========================
  // OPEN REQUEST FORM
  // =========================
  const openRequestForm = (helperName) => {
    setSelectedHelper(helperName);
    setShowForm(true);
  };

  // =========================
  // LOAD NORMAL HELP REQUESTS
  // =========================
  const loadMyRequests = async () => {
    if (!user?.name) {
      setRequestsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/help-requests/elderly/${encodeURIComponent(
          user.name
        )}`
      );

      const result = await response.json();

      console.log("MY HELP REQUESTS:", result);

      if (response.ok && result.success) {
        let requestData = result.data || [];

        if (!Array.isArray(requestData)) {
          requestData = [requestData];
        }

        setRequests(requestData);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error(
        "Loading my requests error:",
        error
      );

      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // =========================
  // LOAD MY SOS
  // =========================
  const loadMySOS = async () => {
    if (!user?.name) {
      setSosLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/sos/elderly/${encodeURIComponent(
          user.name
        )}`
      );

      const result = await response.json();

      console.log("MY SOS REQUEST:", result);

      if (
        response.ok &&
        result.success &&
        result.data
      ) {
        setSosRequest(result.data);
      } else {
        setSosRequest(null);
      }
    } catch (error) {
      console.error(
        "Loading SOS error:",
        error
      );

      setSosRequest(null);
    } finally {
      setSosLoading(false);
    }
  };

  // =========================
  // AUTO REFRESH
  // =========================
  useEffect(() => {
    loadMyRequests();
    loadMySOS();

    const interval = setInterval(() => {
      loadMyRequests();
      loadMySOS();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [user?.name]);

  // =========================
  // SUBMIT NORMAL HELP REQUEST
  // =========================
  const submitRequest = async (e) => {
    e.preventDefault();

    if (!user?.name) {
      alert("Please login first.");
      return;
    }

    if (!selectedHelper) {
      alert("Please select a helper.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/help-requests`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            elderly_id: user.id || null,
            elderly_name: user.name,
            helper_name: selectedHelper,
            request_type: requestType,
            description: description,
            preferred_time: preferredTime,
            status: "pending",
          }),
        }
      );

      const result = await response.json();

      console.log(
        "CREATE HELP REQUEST:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create help request"
        );
      }

      alert(
        `Help request sent successfully!\n\nHelper: ${selectedHelper}`
      );

      setShowForm(false);
      setSelectedHelper("");
      setRequestType("Medicine Pickup");
      setDescription("");
      setPreferredTime("");

      loadMyRequests();
    } catch (error) {
      console.error(
        "Help Request Error:",
        error
      );

      alert(
        `Failed to send help request.\n\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLOSE REQUEST FORM
  // =========================
  const closeRequestForm = () => {
    setShowForm(false);
    setSelectedHelper("");
    setRequestType("Medicine Pickup");
    setDescription("");
    setPreferredTime("");
  };

  return (
    <div className="dashboard">

      {/* =========================
          WELCOME
      ========================= */}

      <section className="welcome-section">

        <h1>
          Good Morning{" "}
          {user?.name || "Asha"} 👋
        </h1>

        <p>
          How can we help you today?
        </p>

      </section>

      {/* =========================
          SOS BUTTON
      ========================= */}

      <SOSButton user={user} />

      {/* =========================
          MY EMERGENCY SOS
      ========================= */}

      <section className="requests-section">

        <div className="section-header">

          <div>

            <h2>
              🚨 My Emergency SOS
            </h2>

            <p>
              Track your emergency
              help request.
            </p>

          </div>

        </div>

        {sosLoading && (
          <div className="request-card">

            <h3>
              Loading SOS status...
            </h3>

          </div>
        )}

        {!sosLoading &&
          !sosRequest && (
            <div className="request-card">

              <h3>
                No Emergency SOS
              </h3>

              <p>
                Your SOS request will
                appear here after you
                send an emergency SOS.
              </p>

            </div>
          )}

        {!sosLoading &&
          sosRequest && (
            <div className="request-card">

              <h3>
                🚨 Emergency SOS Request
              </h3>

              <p>
                <strong>
                  Elderly Person:
                </strong>{" "}
                {sosRequest.elderly_name}
              </p>

              <p>
                <strong>
                  Request:
                </strong>{" "}
                {sosRequest.type}
              </p>

              <p>
                <strong>
                  Message:
                </strong>{" "}
                {sosRequest.message}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {sosRequest.status}
              </p>

              {sosRequest.status ===
                "pending" && (
                <p>
                  ⏳ Waiting for a helper
                  to accept your SOS.
                </p>
              )}

              {sosRequest.status ===
                "accepted" && (
                <div>

                  <h3>
                    ✅ SOS Accepted
                  </h3>

                  <p>
                    Your emergency
                    request has been
                    accepted.
                  </p>

                  <p>
                    <strong>
                      Helper:
                    </strong>{" "}
                    {sosRequest.helper_name ||
                      "Assigned Helper"}
                  </p>

                </div>
              )}

              {sosRequest.status ===
                "in_progress" && (
                <div>

                  <h3>
                    🔄 Help In Progress
                  </h3>

                  <p>
                    Your helper is
                    currently providing
                    assistance.
                  </p>

                  <p>
                    <strong>
                      Helper:
                    </strong>{" "}
                    {sosRequest.helper_name ||
                      "Assigned Helper"}
                  </p>

                </div>
              )}

              {sosRequest.status ===
                "completed" && (
                <div>

                  <h3>
                    ✅ SOS Completed
                  </h3>

                  <p>
                    Emergency assistance
                    has been completed.
                  </p>

                  <p>
                    <strong>
                      Helper:
                    </strong>{" "}
                    {sosRequest.helper_name ||
                      "Assigned Helper"}
                  </p>

                </div>
              )}

            </div>
          )}

      </section>

      {/* =========================
          SERVICE CARDS
      ========================= */}

      <section className="service-grid">

        <div className="service-card">

          <span>👨‍⚕️</span>

          <h3>
            Find Local Helper
          </h3>

          <p>
            Get help from trusted
            people nearby.
          </p>

        </div>

        <div
          className="service-card"
          onClick={() => {
            window.location.href =
              "/family-connect";
          }}
          style={{
            cursor: "pointer",
          }}
        >

          <span>👨‍👩‍👧</span>

          <h3>
            Family Connect
          </h3>

          <p>
            Stay connected with
            your family.
          </p>

        </div>

        <div className="service-card">

          <span>❤️</span>

          <h3>
            Health Log
          </h3>

          <p>
            Track your health
            information.
          </p>

        </div>

        <div className="service-card">

          <span>🏢</span>

          <h3>
            Nearby NGOs
          </h3>

          <p>
            Find nearby
            organizations for
            support.
          </p>

        </div>

      </section>

      {/* =========================
          NEARBY HELPERS
      ========================= */}

      <section className="helpers-section">

        <div className="section-header">

          <div>

            <h2>
              Nearby Helpers
            </h2>

            <p>
              Trusted helpers
              available near you
            </p>

          </div>

          <button
            className="view-all-button"
            type="button"
          >
            View All
          </button>

        </div>

        {/* VAISHNAVI */}

        <HelperCard
          name="Vaishnavi Kavhale"
          rating="5.0"
          distance="Nearby"
          available={true}
          onRequestHelp={
            openRequestForm
          }
        />

        {/* RAJESH */}

        <HelperCard
          name="Rajesh Kumar"
          rating="4.8"
          distance="1.2 km"
          available={true}
          onRequestHelp={
            openRequestForm
          }
        />

        {/* PRIYA */}

        <HelperCard
          name="Priya Sharma"
          rating="4.7"
          distance="2.1 km"
          available={true}
          onRequestHelp={
            openRequestForm
          }
        />

        {/* AMIT */}

        <HelperCard
          name="Amit Verma"
          rating="4.5"
          distance="3.4 km"
          available={false}
          onRequestHelp={
            openRequestForm
          }
        />

      </section>

      {/* =========================
          HELP REQUEST FORM
      ========================= */}

      {showForm && (
        <section className="service-card">

          <h2>
            📝 Request Help
          </h2>

          <p>
            Request help from{" "}
            <strong>
              {selectedHelper}
            </strong>
          </p>

          <form
            onSubmit={submitRequest}
          >

            <label>
              Type of Help
            </label>

            <select
              value={requestType}
              onChange={(e) => {
                setRequestType(
                  e.target.value
                );
              }}
            >

              <option>
                Medicine Pickup
              </option>

              <option>
                Grocery Help
              </option>

              <option>
                Hospital Visit
              </option>

              <option>
                Household Help
              </option>

              <option>
                Accompany Me
              </option>

              <option>
                Other
              </option>

            </select>

            <label>
              Description
            </label>

            <textarea
              placeholder="Describe what help you need..."
              value={description}
              onChange={(e) => {
                setDescription(
                  e.target.value
                );
              }}
              rows="4"
              required
            />

            <label>
              Preferred Time
            </label>

            <input
              type="text"
              placeholder="Example: Today 5:00 PM"
              value={preferredTime}
              onChange={(e) => {
                setPreferredTime(
                  e.target.value
                );
              }}
              required
            />

            <div
              style={{
                marginTop: "15px",
              }}
            >

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
                onClick={
                  closeRequestForm
                }
                style={{
                  marginLeft: "10px",
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </section>
      )}

      {/* =========================
          MY RECENT REQUESTS
      ========================= */}

      <section className="requests-section">

        <div className="section-header">

          <div>

            <h2>
              My Recent Requests
            </h2>

            <p>
              Your latest help
              requests
            </p>

          </div>

        </div>

        {requestsLoading && (
          <div className="request-card">

            <h3>
              Loading your
              requests...
            </h3>

          </div>
        )}

        {!requestsLoading &&
          requests.length === 0 && (
            <div className="request-card">

              <h3>
                No Help Requests Yet
              </h3>

              <p>
                Your submitted help
                requests will appear
                here.
              </p>

            </div>
          )}

        {!requestsLoading &&
          requests.map((item) => (
            <RequestCard
              key={item.id}
              service={
                item.request_type ||
                "Help Request"
              }
              helper={
                item.helper_name ||
                "Not assigned"
              }
              status={
                item.status
                  ? item.status
                      .charAt(0)
                      .toUpperCase() +
                    item.status.slice(1)
                  : "Pending"
              }
              date={
                item.created_at
                  ? new Date(
                      item.created_at
                    ).toLocaleString()
                  : "Date not available"
              }
            />
          ))}

      </section>

    </div>
  );
}

export default Dashboard;


