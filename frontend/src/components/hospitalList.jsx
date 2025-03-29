import React, { useEffect, useState } from "react";
import { fetchHospitals } from "../services/hospital.services.js";

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const hospitalsPerPage = 20;

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const data = await fetchHospitals();
        setHospitals(data);
      } catch (err) {
        setError("Failed to load hospitals");
      } finally {
        setLoading(false);
      }
    };

    loadHospitals();
  }, []);

  if (loading) return <p>Loading hospitals...</p>;
  if (error) return <p>{error}</p>;

  // Pagination Logic
  const lastIndex = currentPage * hospitalsPerPage;
  const firstIndex = lastIndex - hospitalsPerPage;
  const currentHospitals = hospitals.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(hospitals.length / hospitalsPerPage);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Hospitals List</h1>
      <div style={styles.grid}>
        {currentHospitals.map((hospital, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => setSelectedHospital(hospital)}
          >
            <h2>{hospital["HOSPITAL NAME"]}</h2>
            <p>📍 {hospital.CITY}</p>
          </div>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div style={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ⬅ Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ➡
        </button>
      </div>

      {/* Show Hospital Details on Click */}
      {selectedHospital && (
        <div style={styles.details}>
          <h2>{selectedHospital["HOSPITAL NAME"]}</h2>
          <p>📍 {selectedHospital.ADDRESS}</p>
          <p>☎ {selectedHospital.CONTACT}</p>
          <p>🩺 Doctors: {selectedHospital.DOCTORS}</p>
          <button onClick={() => setSelectedHospital(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

// Inline Styles
const styles = {
  container: { textAlign: "center", padding: "20px" },
  heading: { fontSize: "24px", marginBottom: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" },
  card: {
    background: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  pagination: { marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" },
  details: { marginTop: "20px", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }
};

export default HospitalList;
