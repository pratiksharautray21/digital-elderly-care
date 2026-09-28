function HelperCard({
  name,
  rating,
  distance,
  available,
  onRequestHelp,
}) {
  return (
    <div className="helper-card">

      {/* Helper Icon */}
      <div className="helper-avatar">
        👨‍⚕️
      </div>

      {/* Helper Information */}
      <div className="helper-info">

        <h3>
          {name}
        </h3>

        <p>
          ⭐ {rating} &nbsp; 📍 {distance}
        </p>

        <span
          className={
            available
              ? "available"
              : "unavailable"
          }
        >
          {available
            ? "● Available"
            : "● Busy"}
        </span>

      </div>

      {/* Request Help Button */}
      <button
        className="request-button"
        disabled={!available}
        onClick={() => {
          if (onRequestHelp) {
            onRequestHelp(name);
          }
        }}
      >
        Request Help
      </button>

    </div>
  );
}

export default HelperCard;
