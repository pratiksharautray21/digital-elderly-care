import { useEffect, useState } from "react";
import SOSButton from "../components/SOSButton";

function Emergency() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSOSStatus = async () => {
    try {
      const savedUser = localStorage.getItem("currentUser");

      if (!savedUser) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch(
        `https://digital-elderly-care.onrender.com/api/sos/elderly/${encodeURIComponent(
          user.name
        )}`
      );

      const result = await response.json();

      console.log("SOS Status:", result);

      if (result.success && result.data) {
        setRequest(result.data);
      } else {
        setRequest(null);
      }
    } catch (error) {
      console.error("Error loading SOS status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSOSStatus();

    // Check for SOS status changes every 2 seconds
    const interval = setInterval(loadSOSStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">

      {/* ===============================
          PAGE HEADER
      =============================== */}

      <div className="welcome-section">
        <h1>Emergency Help 🚨</h1>

        <p>
          Get immediate assistance from your trusted support network.
        </p>
      </div>


      {/* ===============================
          SOS BUTTON
      =============================== */}

      <div className="service-card">
        <h2>Need Emergency Help?</h2>

        <p>
          Press the SOS button to create an emergency request for your
          connected helpers and family contacts.
        </p>

        <SOSButton />
      </div>


      {/* ===============================
          SOS STATUS
      =============================== */}

      <div className="service-card">

        <h2>🆘 Emergency Status</h2>

        {loading && (
          <p>
            Checking your emergency request...
          </p>
        )}

        {!loading && !request && (
          <div>
            <p>
              No active emergency request found.
            </p>

            <p>
              Press the SOS button above if you need emergency assistance.
            </p>
          </div>
        )}

        {request && (
          <div>

            {/* Request Type */}

            <p>
              <strong>Request:</strong>{" "}
              {request.type}
            </p>


            {/* Pending Status */}

            {request.status === "pending" && (
              <div>

                <p>
                  <strong>Status:</strong>{" "}
                  ⏳ Waiting for a helper
                </p>

                <p>
                  🚨 Your SOS request has been sent successfully.
                </p>

                <p>
                  Please wait while a local helper accepts your request.
                </p>

              </div>
            )}


            {/* Accepted Status */}

            {request.status === "accepted" && (
              <div>

                <p>
                  <strong>Status:</strong>{" "}
                  ✅ Accepted
                </p>

                <h3>
                  💚 Help is on the way!
                </h3>

                <p>
                  <strong>Your Helper:</strong>{" "}
                  {request.helper_name}
                </p>

                <p>
                  ✅ {request.helper_name} has accepted your emergency
                  request.
                </p>

                <p>
                  Please stay safe and wait for your helper.
                </p>

              </div>
            )}

          </div>
        )}

      </div>


      {/* ===============================
          EMERGENCY SERVICES
      =============================== */}

      <div className="service-grid">

        <div className="service-card">
          <span>📍</span>

          <h3>Location</h3>

          <p>
            Your location can be shared with the selected support network.
          </p>
        </div>


        <div className="service-card">
          <span>👨‍⚕️</span>

          <h3>Local Helpers</h3>

          <p>
            Nearby available helpers can respond to your request.
          </p>
        </div>


        <div className="service-card">
          <span>👨‍👩‍👧</span>

          <h3>Family</h3>

          <p>
            Your connected family members can be notified.
          </p>
        </div>


        <div className="service-card">
          <span>📞</span>

          <h3>Emergency Contacts</h3>

          <p>
            Your saved emergency contacts can be reached.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Emergency;
