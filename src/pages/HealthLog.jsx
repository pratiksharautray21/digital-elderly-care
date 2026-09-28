import { useEffect, useState } from "react";

function HealthLog() {
  const emptyHealth = {
    blood_pressure: "",
    heart_rate: "",
    temperature: "",
    blood_sugar: "",
    medicines: "",
    doctor_visit: "",
    notes: "",
  };

  const [health, setHealth] = useState(emptyHealth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const elderlyName = currentUser?.name || "asha";

  const API_URL = "https://digital-elderly-care.onrender.com/api/health-logs";

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setHealth({
      ...health,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOAD HEALTH RECORDS
  // =========================
  const loadHealthRecords = async () => {
    try {
      setFetching(true);

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(elderlyName)}`
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setRecords(result.data || []);
      } else {
        console.error("Failed to load health records");
      }
    } catch (error) {
      console.error("Error loading health records:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadHealthRecords();
  }, []);

  // =========================
  // SAVE OR UPDATE RECORD
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasData = Object.values(health).some(
      (value) => value.trim() !== ""
    );

    if (!hasData) {
      alert("Please enter at least one health detail.");
      return;
    }

    try {
      setLoading(true);

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elderly_name: elderlyName,
          ...health,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save health record"
        );
      }

      alert(
        editingId
          ? "Health record updated successfully!"
          : "Health information saved successfully!"
      );

      setHealth(emptyHealth);
      setEditingId(null);
      await loadHealthRecords();
    } catch (error) {
      console.error("Save/Update Health Error:", error);
      alert(error.message || "Failed to save health information.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT HEALTH RECORD
  // =========================
  const handleEdit = (record) => {
    setEditingId(record.id);

    setHealth({
      blood_pressure: record.blood_pressure || "",
      heart_rate: record.heart_rate || "",
      temperature: record.temperature || "",
      blood_sugar: record.blood_sugar || "",
      medicines: record.medicines || "",
      doctor_visit: record.doctor_visit || "",
      notes: record.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditingId(null);
    setHealth(emptyHealth);
  };

  // =========================
  // DELETE HEALTH RECORD
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this health record?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete record"
        );
      }

      alert("Health record deleted successfully!");

      if (editingId === id) {
        cancelEdit();
      }

      await loadHealthRecords();
    } catch (error) {
      console.error("Delete Health Error:", error);
      alert("Failed to delete health record.");
    }
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="welcome-section">
        <h1>Health Log</h1>

        <p>
          Keep a record of your daily health information.
        </p>

        <p>
          <strong>Elderly User:</strong> {elderlyName}
        </p>
      </div>

      {/* HEALTH FORM */}
      <div className="service-card">
        <h2>
          {editingId
            ? "✏️ Edit Health Record"
            : "Today's Health Information"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Blood Pressure</label>

          <input
            type="text"
            name="blood_pressure"
            placeholder="Example: 120/80"
            value={health.blood_pressure}
            onChange={handleChange}
          />

          <label>Heart Rate</label>

          <input
            type="number"
            name="heart_rate"
            placeholder="Example: 72"
            value={health.heart_rate}
            onChange={handleChange}
          />

          <label>Temperature</label>

          <input
            type="text"
            name="temperature"
            placeholder="Example: 98.6 °F"
            value={health.temperature}
            onChange={handleChange}
          />

          <label>Blood Sugar</label>

          <input
            type="text"
            name="blood_sugar"
            placeholder="Example: 110 mg/dL"
            value={health.blood_sugar}
            onChange={handleChange}
          />

          <label>Medicines</label>

          <textarea
            name="medicines"
            placeholder="Enter medicine names and timings"
            value={health.medicines}
            onChange={handleChange}
            rows="3"
          />

          <label>Doctor Visit</label>

          <input
            type="text"
            name="doctor_visit"
            placeholder="Example: Doctor visit on 20 September"
            value={health.doctor_visit}
            onChange={handleChange}
          />

          <label>Additional Notes</label>

          <textarea
            name="notes"
            placeholder="Add other health-related notes"
            value={health.notes}
            onChange={handleChange}
            rows="4"
          />

          <button
            type="submit"
            className="request-button"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Health Log"
              : "Save Health Log"}
          </button>

          {editingId && (
            <button
              type="button"
              className="request-button"
              onClick={cancelEdit}
              style={{ marginLeft: "10px" }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* SAVED RECORDS */}
      <div className="service-card">
        <h2>Saved Health Records</h2>

        {fetching && <p>Loading health records...</p>}

        {!fetching && records.length === 0 && (
          <p>No health records available yet.</p>
        )}

        {!fetching &&
          records.map((record) => (
            <div
              key={record.id}
              className="request-card"
            >
              <h3>Health Record #{record.id}</h3>

              <p>
                <strong>Date:</strong>{" "}
                {record.created_at
                  ? new Date(record.created_at).toLocaleString()
                  : "Not available"}
              </p>

              <p>
                <strong>Blood Pressure:</strong>{" "}
                {record.blood_pressure || "Not added"}
              </p>

              <p>
                <strong>Heart Rate:</strong>{" "}
                {record.heart_rate || "Not added"}
              </p>

              <p>
                <strong>Temperature:</strong>{" "}
                {record.temperature || "Not added"}
              </p>

              <p>
                <strong>Blood Sugar:</strong>{" "}
                {record.blood_sugar || "Not added"}
              </p>

              <p>
                <strong>Medicines:</strong>{" "}
                {record.medicines || "Not added"}
              </p>

              <p>
                <strong>Doctor Visit:</strong>{" "}
                {record.doctor_visit || "Not added"}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {record.notes || "Not added"}
              </p>

              <button
                type="button"
                className="request-button"
                onClick={() => handleEdit(record)}
              >
                ✏️ Edit Record
              </button>

              <button
                type="button"
                className="request-button"
                onClick={() => handleDelete(record.id)}
                style={{ marginLeft: "10px" }}
              >
                🗑️ Delete Record
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default HealthLog;
