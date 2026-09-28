function AdminDashboard() {
  const helpers = [
    {
      name: "Rajesh Kumar",
      location: "1.2 km",
      rating: "4.8",
      status: "Available",
    },
    {
      name: "Priya Sharma",
      location: "2.1 km",
      rating: "4.7",
      status: "Available",
    },
    {
      name: "Amit Verma",
      location: "3.4 km",
      rating: "4.5",
      status: "Busy",
    },
  ];

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Admin Dashboard 👨‍💼</h1>
        <p>Manage local helpers and elderly care requests.</p>
      </div>

      <div className="service-grid">
        <div className="service-card">
          <span>👴</span>
          <h3>124</h3>
          <p>Registered Elderly</p>
        </div>

        <div className="service-card">
          <span>👨‍⚕️</span>
          <h3>38</h3>
          <p>Local Helpers</p>
        </div>

        <div className="service-card">
          <span>📋</span>
          <h3>17</h3>
          <p>Active Requests</p>
        </div>

        <div className="service-card">
          <span>🚨</span>
          <h3>3</h3>
          <p>Emergency Requests</p>
        </div>
      </div>

      <section className="helpers-section">
        <div className="section-header">
          <div>
            <h2>Helper Management</h2>
            <p>View helpers registered on the platform.</p>
          </div>
        </div>

        {helpers.map((helper) => (
          <div className="helper-card" key={helper.name}>
            <div className="helper-avatar">👨‍⚕️</div>

            <div className="helper-info">
              <h3>{helper.name}</h3>
              <p>
                ⭐ {helper.rating} &nbsp; 📍 {helper.location}
              </p>

              <span
                className={
                  helper.status === "Available"
                    ? "available"
                    : "unavailable"
                }
              >
                ● {helper.status}
              </span>
            </div>

            <button
              className="request-button"
              onClick={() => alert(`Viewing ${helper.name}`)}
            >
              View Profile
            </button>
          </div>
        ))}
      </section>

      <section className="requests-section">
        <div className="section-header">
          <div>
            <h2>Recent Requests</h2>
            <p>Monitor recent elderly care requests.</p>
          </div>
        </div>

        <div className="request-card">
          <div className="request-icon">🚨</div>

          <div className="request-info">
            <h3>Emergency Assistance</h3>
            <p>Elderly user: Asha</p>
            <p>Nearby helper requested</p>
          </div>

          <span className="request-status pending">
            Pending
          </span>
        </div>

        <div className="request-card">
          <div className="request-icon">💊</div>

          <div className="request-info">
            <h3>Medicine Pickup</h3>
            <p>Elderly user: Asha</p>
            <p>Helper: Rajesh Kumar</p>
          </div>

          <span className="request-status accepted">
            Accepted
          </span>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
