function RequestCard({ service, helper, status, date }) {
  return (
    <div className="request-card">
      <div className="request-icon">📋</div>

      <div className="request-info">
        <h3>{service || "Help Request"}</h3>

        <p>
          <strong>Helper:</strong>{" "}
          {helper || "Not assigned"}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {date || "Date not available"}
        </p>
      </div>

      <div className="request-status-container">
        <span
          className={`request-status ${
            status ? status.toLowerCase() : "pending"
          }`}
        >
          {status || "Pending"}
        </span>
      </div>
    </div>
  );
}

export default RequestCard;