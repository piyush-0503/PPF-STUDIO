import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://ppf-studio-backend-2026.onrender.com";

export default function LeadRevenueCenter() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_URL}/api/bookings`,
        { timeout: 30000 }
      );

      const responseData = res.data;

      const data = Array.isArray(responseData)
        ? responseData
        : responseData.bookings || [];

      setBookings(data);
    } catch (err) {
      console.error(
        "Failed to fetch leads:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load leads. Please check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Leads with an estimated price above zero
  const convertedLeads = bookings.filter(
    (item) => Number(item.estimatedPrice) > 0
  ).length;

  // This is estimated booking value, not verified collected revenue.
  const totalEstimatedValue = bookings.reduce(
    (sum, item) =>
      sum + (Number(item.estimatedPrice) || 0),
    0
  );

  const averageTicket = bookings.length
    ? Math.floor(totalEstimatedValue / bookings.length)
    : 0;

  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const cellStyle = {
    padding: "14px",
    textAlign: "left",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
  };

  const buttonStyle = {
    background: "#FFD700",
    color: "#111",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "700",
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "clamp(15px, 3vw, 30px)",
        boxSizing: "border-box",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(25px, 4vw, 38px)",
            margin: 0,
          }}
        >
          Lead & Revenue Center
        </h1>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: "20px",
            padding: "14px",
            borderRadius: "10px",
            background: "#3b1720",
            color: "#ffb4c0",
            overflowWrap: "anywhere",
          }}
        >
          {error}
        </div>
      )}

      {!error && !loading && (
        <p
          style={{
            color: "#94a3b8",
            marginTop: "15px",
            fontSize: "13px",
          }}
        >
          Values are calculated from the estimated prices saved in bookings.
          They are not verified payments.
        </p>
      )}

      {/* Statistics */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(min(100%,220px),1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <Card
          title="Total Leads"
          value={bookings.length}
        />

        <Card
          title="Converted Leads"
          value={convertedLeads}
        />

        <Card
          title="Total Estimated Value"
          value={formatCurrency(totalEstimatedValue)}
        />

        <Card
          title="Average Ticket"
          value={formatCurrency(averageTicket)}
        />
      </section>

      {/* Latest Leads */}
      <section
        style={{
          marginTop: "40px",
          background: "#1e293b",
          padding: "clamp(12px, 3vw, 20px)",
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Latest Leads
        </h2>

        {loading ? (
          <p style={{ color: "#FFD700", padding: "20px 0" }}>
            Loading leads...
          </p>
        ) : error ? (
          <p style={{ color: "#ffb4c0" }}>
            Unable to display leads.
          </p>
        ) : bookings.length === 0 ? (
          <p style={{ color: "#94a3b8", padding: "20px 0" }}>
            No bookings found.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: "650px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {[
                  "Name",
                  "Vehicle",
                  "Service",
                  "Estimated Value",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      ...cellStyle,
                      color: "#FFD700",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...bookings]
                .reverse()
                .map((item) => (
                  <tr key={item._id}>
                    <td style={cellStyle}>
                      {item.customerName || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {[
                        item.brand,
                        item.vehicleModel,
                      ]
                        .filter(Boolean)
                        .join(" ") || "N/A"}
                    </td>

                    <td style={cellStyle}>
                      {item.serviceType || "N/A"}
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        color: "#00e676",
                      }}
                    >
                      {formatCurrency(
                        Number(item.estimatedPrice) || 0
                      )}
                    </td>

                    <td style={cellStyle}>
                      {item.status || "Pending"}
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

function Card({ title, value }) {
  return (
    <article
      style={{
        background: "#1e293b",
        padding: "22px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.06)",
        overflowWrap: "anywhere",
      }}
    >
      <h3
        style={{
          color: "#cbd5e1",
          fontSize: "15px",
          marginTop: 0,
        }}
      >
        {title}
      </h3>

      <h2
        style={{
          color: "#00e676",
          fontSize: "clamp(23px, 3vw, 30px)",
          marginBottom: 0,
        }}
      >
        {value}
      </h2>
    </article>
  );
}

