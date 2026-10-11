import { useEffect, useState } from "react";
import axios from "axios";

// Live backend URL
const API_URL = "https://ppf-studio-backend-2026.onrender.com";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setError("");

      const res = await axios.get(
        `${API_URL}/api/bookings`
      );

      // Support common API response formats
      const data = res.data;
      const bookingList = Array.isArray(data)
        ? data
        : data.bookings || [];

      setBookings(bookingList);
    } catch (err) {
      console.error(
        "Fetch bookings error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Bookings load nahi hui. Backend aur API route check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Mark booking as completed
  const completeBooking = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is booking ko Completed mark karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setError("");

      await axios.put(
        `${API_URL}/api/bookings/complete/${id}`
      );

      alert("Job Completed Successfully ✅");
      await fetchBookings();
    } catch (err) {
      console.error(
        "Complete booking error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Booking complete nahi hui. Backend route check karo."
      );
    } finally {
      setActionLoading("");
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is booking ko permanently delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setError("");

      await axios.delete(
        `${API_URL}/api/bookings/${id}`
      );

      alert("Booking Deleted Successfully ✅");
      await fetchBookings();
    } catch (err) {
      console.error(
        "Delete booking error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Booking delete nahi hui. Backend route check karo."
      );
    } finally {
      setActionLoading("");
    }
  };

  const cellStyle = {
    padding: "12px",
    textAlign: "center",
    fontSize: "14px",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding:
          window.innerWidth < 768 ? "15px" : "40px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize:
            window.innerWidth < 768 ? "28px" : "42px",
          marginBottom: "30px",
          marginTop: "20px",
          fontWeight: "800",
          lineHeight: "1.3",
          background:
            "linear-gradient(90deg,#FFD700,#ff6b00)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Premium Booking Center
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "18px",
        }}
      >
        <p style={{ margin: 0, color: "#ccc" }}>
          Total Bookings: {bookings.length}
        </p>

        <button
          onClick={fetchBookings}
          disabled={loading}
          style={{
            background: "#FFD700",
            color: "#111",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: "700",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: "#351010",
            color: "#ff8a80",
            padding: "14px",
            borderRadius: "10px",
            marginBottom: "18px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: "#0d0d0d",
          borderRadius: "20px",
          padding: "16px",
          overflowX: "auto",
          border: "1px solid rgba(255,215,0,0.15)",
          boxShadow: "0 0 30px rgba(255,215,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "900px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {[
                "Customer",
                "Phone",
                "Vehicle",
                "Service",
                "Price",
                "Status",
                "Action",
              ].map((item) => (
                <th
                  key={item}
                  style={{
                    padding: "14px",
                    color: "#FFD700",
                    fontSize: "15px",
                    textAlign: "center",
                    borderBottom:
                      "1px solid rgba(255,215,0,0.3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!loading && bookings.length === 0 && !error && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    ...cellStyle,
                    padding: "30px",
                    color: "#aaa",
                  }}
                >
                  Abhi koi booking available nahi hai.
                </td>
              </tr>
            )}

            {bookings
              .filter((b) => b.status !== "Completed")
              .map((b) => (
                <tr
                  key={b._id}
                  style={{
                    borderBottom:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <td style={cellStyle}>
                    {b.customerName || "N/A"}
                  </td>

                  <td style={cellStyle}>
                    {b.phone || "N/A"}
                  </td>

                  <td style={cellStyle}>
                    {[b.brand, b.vehicleModel]
                      .filter(Boolean)
                      .join(" ") || "N/A"}
                  </td>

                  <td style={cellStyle}>
                    {b.serviceType || "N/A"}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      color: "#00e676",
                      fontWeight: "700",
                    }}
                  >
                    ₹{b.estimatedPrice ?? 0}
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        background:
                          "rgba(255,174,0,0.15)",
                        color: "#ffae00",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.status || "Pending"}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        minWidth: "170px",
                      }}
                    >
                      <button
                        onClick={() => completeBooking(b._id)}
                        disabled={actionLoading === b._id}
                        style={{
                          background:
                            "linear-gradient(135deg,#00c853,#00e676)",
                          border: "none",
                          padding: "10px 14px",
                          color: "#fff",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                          opacity:
                            actionLoading === b._id ? 0.6 : 1,
                        }}
                      >
                        {actionLoading === b._id
                          ? "Please wait..."
                          : "✅ Done"}
                      </button>

                      <button
                        onClick={() => deleteBooking(b._id)}
                        disabled={actionLoading === b._id}
                        style={{
                          background:
                            "linear-gradient(135deg,#ff1744,#ff4569)",
                          border: "none",
                          padding: "10px 14px",
                          color: "#fff",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                          opacity:
                            actionLoading === b._id ? 0.6 : 1,
                        }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

