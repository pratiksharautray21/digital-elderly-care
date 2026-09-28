
import { useEffect, useState } from "react";

function HelperDashboard({ user, onLogout }) {
  const API_URL = "https://digital-elderly-care.onrender.com";

  // =========================
  // SOS REQUEST
  // =========================
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // NORMAL HELP REQUEST
  // =========================
  const [helpRequest, setHelpRequest] = useState(null);
  const [helpLoading, setHelpLoading] = useState(true);

  // =========================
  // LOAD SOS REQUEST
  // =========================
  const loadRequest = async () => {
    try {
      const helperName = encodeURIComponent(
        user?.name || ""
      );

      // First check if this helper already
      // has an assigned SOS
      const assignedResponse = await fetch(
        `${API_URL}/api/sos/helper/${helperName}`
      );

      const assignedResult =
        await assignedResponse.json();

      console.log(
        "ASSIGNED SOS RESPONSE:",
        assignedResult
      );

      if (
        assignedResponse.ok &&
        assignedResult.success &&
        assignedResult.data
      ) {
        setRequest(assignedResult.data);
        return;
      }

      // If helper has no assigned SOS,
      // check pending SOS
      const pendingResponse = await fetch(
        `${API_URL}/api/sos/pending`
      );

      const pendingResult =
        await pendingResponse.json();

      console.log(
        "PENDING SOS RESPONSE:",
        pendingResult
      );

      if (
        pendingResponse.ok &&
        pendingResult.success &&
        pendingResult.data
      ) {
        setRequest(pendingResult.data);
      } else {
        // Do not remove an already accepted request
        setRequest((currentRequest) => {
          if (
            currentRequest &&
            currentRequest.helper_name ===
              user?.name &&
            (
              currentRequest.status ===
                "accepted" ||
              currentRequest.status ===
                "in_progress"
            )
          ) {
            return currentRequest;
          }

          return null;
        });
      }
    } catch (error) {
      console.error(
        "Error loading SOS:",
        error
      );
    } finally {
      setLoading(false);
    }
  };
// =========================
// LOAD NORMAL HELP REQUEST
// =========================
const loadHelpRequest = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/help-requests/pending`
    );

    const result = await response.json();

    console.log(
      "HELP REQUEST RESPONSE:",
      result
    );

    if (
      response.ok &&
      result.success &&
      result.data
    ) {
      setHelpRequest((currentRequest) => {

        // Keep the currently assigned request
        // when it is already accepted,
        // in progress, or completed.
        if (
          currentRequest &&
          currentRequest.helper_name ===
            user?.name &&
          (
            currentRequest.status === "accepted" ||
            currentRequest.status === "in_progress" ||
            currentRequest.status === "completed"
          )
        ) {
          return currentRequest;
        }

        return result.data;
      });
    } else {
      setHelpRequest((currentRequest) => {

        // Do not remove an assigned request
        // after it has been accepted,
        // started, or completed.
        if (
          currentRequest &&
          currentRequest.helper_name ===
            user?.name &&
          (
            currentRequest.status === "accepted" ||
            currentRequest.status === "in_progress" ||
            currentRequest.status === "completed"
          )
        ) {
          return currentRequest;
        }

        return null;
      });
    }
  } catch (error) {
    console.error(
      "Error loading help request:",
      error
    );
  } finally {
    setHelpLoading(false);
  }
};
           

  // =========================
  // LOAD BOTH REQUESTS
  // =========================
  useEffect(() => {
    loadRequest();
    loadHelpRequest();

    const interval = setInterval(() => {
      loadRequest();
      loadHelpRequest();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [user?.name]);

  // =========================
  // ACCEPT SOS
  // =========================
  const acceptRequest = async () => {
    if (!request) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/sos/${request.id}/accept`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            helper_id: null,
            helper_name: user?.name,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "ACCEPT SOS RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to accept SOS request"
        );
      }

      setRequest(result.data);

      alert(
        "SOS request accepted successfully!"
      );
    } catch (error) {
      console.error(
        "Accept SOS Error:",
        error
      );

      alert(
        "Failed to accept SOS request.\n\n" +
          error.message
      );
    }
  };

  // =========================
  // START SOS HELP
  // =========================
  const startRequest = async () => {
    if (!request) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/sos/${request.id}/start`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const result =
        await response.json();

      console.log(
        "START SOS RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to start SOS help"
        );
      }

      setRequest(result.data);

      alert(
        "SOS help started successfully!"
      );
    } catch (error) {
      console.error(
        "Start SOS Error:",
        error
      );

      alert(
        "Failed to start SOS help.\n\n" +
          error.message
      );
    }
  };

  // =========================
  // COMPLETE SOS
  // =========================
  const completeRequest = async () => {
    if (!request) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/sos/${request.id}/complete`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const result =
        await response.json();

      console.log(
        "COMPLETE SOS RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to complete SOS"
        );
      }

      setRequest(result.data);

      alert(
        "SOS help completed successfully!"
      );
    } catch (error) {
      console.error(
        "Complete SOS Error:",
        error
      );

      alert(
        "Failed to complete SOS.\n\n" +
          error.message
      );
    }
  };

  // =========================
  // ACCEPT NORMAL HELP
  // =========================
  const acceptHelpRequest = async () => {
    if (!helpRequest) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/help-requests/${helpRequest.id}/accept`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            helper_id: null,
            helper_name: user?.name,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "ACCEPT HELP RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to accept help request"
        );
      }

      setHelpRequest(result.data);

      alert(
        "Help request accepted successfully!"
      );
    } catch (error) {
      console.error(
        "Accept Help Error:",
        error
      );

      alert(
        "Failed to accept help request.\n\n" +
          error.message
      );
    }
  };

  // =========================
  // START NORMAL HELP
  // =========================
  const startHelpRequest = async () => {
    if (!helpRequest) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/help-requests/${helpRequest.id}/start`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const result =
        await response.json();

      console.log(
        "START HELP RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to start help"
        );
      }

      setHelpRequest(result.data);

      alert(
        "Help request started successfully!"
      );
    } catch (error) {
      console.error(
        "Start Help Error:",
        error
      );

      alert(
        "Failed to start help.\n\n" +
          error.message
      );
    }
  };

  // =========================
  // COMPLETE NORMAL HELP
  // =========================
  const completeHelpRequest = async () => {
    if (!helpRequest) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/help-requests/${helpRequest.id}/complete`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const result =
        await response.json();

      console.log(
        "COMPLETE HELP RESPONSE:",
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to complete help"
        );
      }

      setHelpRequest(result.data);

      alert(
        "Help request completed successfully!"
      );
    } catch (error) {
      console.error(
        "Complete Help Error:",
        error
      );

      alert(
        "Failed to complete help.\n\n" +
          error.message
      );
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="helper-dashboard">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <div>
          <h2>
            Digital Elderly Care
          </h2>

          <p>
            Local Helper Dashboard
          </p>
        </div>

        <div>

          <span>
            👤 {user?.name || "Helper"}
          </span>

          <button
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">

        <h1>
          Welcome,{" "}
          {user?.name || "Helper"} 👋
        </h1>

        <p>
          You are logged in as a
          Local Helper.
        </p>

        <hr />

        {/* =========================
            EMERGENCY SOS
        ========================= */}

        <h2>
          🚨 Emergency SOS Requests
        </h2>

        {loading && (
          <div className="request-card">

            <h3>
              Loading emergency
              requests...
            </h3>

          </div>
        )}

        {!loading && !request && (
          <div className="request-card">

            <h3>
              No Emergency Requests
            </h3>

            <p>
              You will see an SOS
              request here when an
              elderly person needs
              emergency help.
            </p>

          </div>
        )}

        {request && (
          <div className="request-card">

            <h3>
              🚨 Emergency SOS
            </h3>

            <p>
              <strong>
                Elderly Person:
              </strong>{" "}
              {request.elderly_name}
            </p>

            <p>
              <strong>
                Request:
              </strong>{" "}
              {request.type}
            </p>

            <p>
              <strong>
                Message:
              </strong>{" "}
              {request.message}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {request.status}
            </p>

            {request.status ===
              "pending" && (
              <button
                onClick={acceptRequest}
                className="login-button"
              >
                ✅ Accept SOS Request
              </button>
            )}

            {request.status ===
              "accepted" && (
              <div>

                <h3>
                  ✅ SOS Request Accepted
                </h3>

                <p>
                  You are assigned to
                  help{" "}
                  <strong>
                    {request.elderly_name}
                  </strong>
                  .
                </p>

                <p>
                  <strong>
                    Helper:
                  </strong>{" "}
                  {request.helper_name ||
                    user?.name}
                </p>

                <button
                  onClick={
                    startRequest
                  }
                  className="login-button"
                >
                  ▶️ Start Help
                </button>

              </div>
            )}

            {request.status ===
              "in_progress" && (
              <div>

                <h3>
                  🔄 Help In Progress
                </h3>

                <p>
                  You are currently
                  helping{" "}
                  <strong>
                    {request.elderly_name}
                  </strong>
                  .
                </p>

                <p>
                  <strong>
                    Helper:
                  </strong>{" "}
                  {request.helper_name ||
                    user?.name}
                </p>

                <button
                  onClick={
                    completeRequest
                  }
                  className="login-button"
                >
                  ✅ Complete Help
                </button>

              </div>
            )}

            {request.status ===
              "completed" && (
              <div>

                <h3>
                  ✅ SOS Help Completed
                </h3>

                <p>
                  Emergency assistance
                  for{" "}
                  <strong>
                    {request.elderly_name}
                  </strong>{" "}
                  has been completed.
                </p>

                <p>
                  <strong>
                    Helper:
                  </strong>{" "}
                  {request.helper_name ||
                    user?.name}
                </p>

              </div>
            )}

          </div>
        )}

        {/* =========================
            NORMAL HELP REQUESTS
        ========================= */}

        <hr />

        <h2>
          📋 Normal Help Requests
        </h2>

        {helpLoading && (
          <div className="request-card">

            <h3>
              Loading help requests...
            </h3>

          </div>
        )}

        {!helpLoading &&
          !helpRequest && (
            <div className="request-card">

              <h3>
                No Pending Help Requests
              </h3>

              <p>
                Normal help requests
                from elderly users
                will appear here.
              </p>

            </div>
          )}

        {helpRequest && (
          <div className="request-card">

            <h3>
              📋 Help Request
            </h3>

            <p>
              <strong>
                Elderly Person:
              </strong>{" "}
              {helpRequest.elderly_name}
            </p>

            <p>
              <strong>
                Type of Help:
              </strong>{" "}
              {helpRequest.request_type}
            </p>

            <p>
              <strong>
                Description:
              </strong>{" "}
              {helpRequest.description}
            </p>

            <p>
              <strong>
                Preferred Time:
              </strong>{" "}
              {helpRequest.preferred_time}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {helpRequest.status}
            </p>

            {helpRequest.status ===
              "pending" && (
              <button
                onClick={
                  acceptHelpRequest
                }
                className="login-button"
              >
                ✅ Accept Help Request
              </button>
            )}

            {helpRequest.status ===
              "accepted" && (
              <div>

                <h3>
                  ✅ Help Request Accepted
                </h3>

                <p>
                  You are assigned to
                  help{" "}
                  <strong>
                    {
                      helpRequest.elderly_name
                    }
                  </strong>
                  .
                </p>

                <p>
                  <strong>
                    Helper:
                  </strong>{" "}
                  {helpRequest.helper_name ||
                    user?.name}
                </p>

                <button
                  onClick={
                    startHelpRequest
                  }
                  className="login-button"
                >
                  ▶️ Start Help
                </button>

              </div>
            )}

            {helpRequest.status ===
              "in_progress" && (
              <div>

                <h3>
                  🔄 Help In Progress
                </h3>

                <p>
                  You are currently
                  helping{" "}
                  <strong>
                    {
                      helpRequest.elderly_name
                    }
                  </strong>
                  .
                </p>

                <p>
                  <strong>
                    Helper:
                  </strong>{" "}
                  {helpRequest.helper_name ||
                    user?.name}
                </p>

                <button
                  onClick={
                    completeHelpRequest
                  }
                  className="login-button"
                >
                  ✅ Complete Help
                </button>

              </div>
            )}

            {helpRequest.status ===
              "completed" && (
              <div>

                <h3>
                  ✅ Help Request Completed
                </h3>

                <p>
                  Help for{" "}
                  <strong>
                    {
                      helpRequest.elderly_name
                    }
                  </strong>{" "}
                  has been completed.
                </p>

                <p>
                  <strong>
                    Helper:
                  </strong>{" "}
                  {helpRequest.helper_name ||
                    user?.name}
                </p>

              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}

export default HelperDashboard;


