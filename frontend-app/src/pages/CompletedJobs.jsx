import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://ppf-studio-backend-2026.onrender.com";

export default function CompletedJobs() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch completed jobs from live backend
  const fetchCompleted = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_URL}/api/bookings/completed`,
        { timeout: 30000 }
      );

      const data = res.data;

      const completedBookings = Array.isArray(data)
        ? data
        : data.bookings || [];

      setBookings(completedBookings);
    } catch (err) {
      console.error(
        "Failed to fetch completed jobs:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load completed jobs. Please check the backend API and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted();
  }, []);

  const cellStyle = {
    padding: "16px",
    overflowWrap: "anywhere",
    textAlign: "center",
    fontSize: "14px",
  };

  const buttonStyle = {
    background: "#D4AF37",
    color: "#111",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: "100px clamp(15px, 4vw, 40px) 40px",
        fontFamily: "Poppins, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "clamp(30px, 5vw, 48px)",
          fontWeight: 800,
          margin: "20px 0 40px",
          lineHeight: 1.3,
          background:
            "linear-gradient(90deg,#FFD700,#00e676)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ✅ Completed Jobs
      </h1>

      {/* Completed jobs count */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            background: "#111",
            padding: "25px 30px",
            borderRadius: 20,
            width: "100%",
            maxWidth: 300,
            textAlign: "center",
            border: "1px solid rgba(0,255,100,.2)",
            boxShadow: "0 0 25px rgba(0,255,100,.12)",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              color: "#00e676",
              margin: 0,
              fontSize: 38,
            }}
          >
            {bookings.length}
          </h2>

          <p style={{ color: "#ccc", marginTop: 10 }}>
            Total Completed Jobs
          </p>
        </div>
      </section>

      {/* Completed jobs table */}
      <section
        style={{
          background: "#111",
          borderRadius: 20,
          padding: "clamp(12px, 3vw, 25px)",
          overflowX: "auto",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 0 30px rgba(255,255,255,.05)",
        }}
      >
        {loading ? (
          <p
            style={{
              textAlign: "center",
              color: "#FFD700",
              padding: 30,
            }}
          >
            Loading completed jobs...
          </p>
        ) : error ? (
          <div
            role="alert"
            style={{ textAlign: "center", padding: 30 }}
          >
            <p style={{ color: "#ff7777" }}>{error}</p>

            <button
              type="button"
              onClick={fetchCompleted}
              style={buttonStyle}
            >
              Retry
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <h2
            style={{
              textAlign: "center",
              color: "#aaa",
              padding: 40,
              fontSize: "clamp(18px, 3vw, 24px)",
            }}
          >
            No Completed Jobs Found
          </h2>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: 560,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {[
                  "Customer",
                  "Vehicle",
                  "Service",
                  "Completed Date",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: 16,
                      color: "#FFD700",
                      fontSize: 15,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      borderBottom:
                        "1px solid rgba(255,215,0,.2)",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  style={{
                    borderBottom:
                      "1px solid rgba(255,255,255,.05)",
                  }}
                >
                  <td style={cellStyle}>
                    {booking.customerName || "N/A"}
                  </td>

                  <td style={cellStyle}>
                    {[
                      booking.brand,
                      booking.vehicleModel,
                    ]
                      .filter(Boolean)
                      .join(" ") || "N/A"}
                  </td>

                  <td style={cellStyle}>
                    {booking.serviceType || "N/A"}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      color: "#bbb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {booking.completedAt &&
                    !Number.isNaN(
                      new Date(booking.completedAt).getTime()
                    )
                      ? new Date(
                          booking.completedAt
                        ).toLocaleDateString("en-IN")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

