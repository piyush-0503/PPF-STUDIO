import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL =
  "https://ppf-studio-backend-2026.onrender.com";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalGallery: 0,
    totalReviews: 0,
    completedJobs: 0,
    pendingJobs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_URL}/api/dashboard`,
        { timeout: 30000 }
      );

      const data = res.data?.stats || res.data;

      setStats((previous) => ({
        ...previous,
        ...data,
      }));
    } catch (err) {
      console.error(
        "Failed to fetch dashboard:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login", { replace: true });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: "clamp(15px, 3vw, 30px)",
        boxSizing: "border-box",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Dashboard Header */}
      <header
        style={{
          textAlign: "center",
          padding: "40px 10px",
          marginBottom: 30,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 70px)",
            fontWeight: 800,
            margin: "0 0 20px",
            lineHeight: 1.2,
            overflowWrap: "anywhere",
            background:
              "linear-gradient(90deg,#FFD700,#FF7A00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Premium PPF Dashboard
        </h1>

        <p
          style={{
            color: "#bbb",
            fontSize: "clamp(16px, 2vw, 22px)",
          }}
        >
          XPEL • Garware • Llumar • STEK
        </p>
      </header>

      {/* Loading */}
      {loading && (
        <p
          style={{
            textAlign: "center",
            color: "#FFD700",
            padding: 15,
          }}
        >
          Loading dashboard...
        </p>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            textAlign: "center",
            marginBottom: 25,
            padding: 15,
            borderRadius: 10,
            background: "#301416",
          }}
        >
          <p style={{ color: "#ff7777" }}>{error}</p>

          <button
            type="button"
            onClick={fetchDashboard}
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Loading..." : "Retry"}
          </button>
        </div>
      )}

      {/* Statistics */}
      <section
        aria-label="Dashboard statistics"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(min(100%,220px),1fr))",
          gap: 20,
        }}
      >
        <Card
          title="Total Bookings"
          value={stats.totalBookings}
        />

        <Card
          title="Pending Jobs"
          value={stats.pendingJobs}
        />

        <Card
          title="Completed Jobs"
          value={stats.completedJobs}
        />

        <Card
          title="Gallery Images"
          value={stats.totalGallery}
        />

        <Card
          title="Reviews"
          value={stats.totalReviews}
        />
      </section>

      {/* Admin Controls */}
      <section style={{ marginTop: 50 }}>
        <h2
          style={{
            color: "#ff3b3b",
            overflowWrap: "anywhere",
          }}
        >
          Admin Controls
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 15,
            marginTop: 20,
          }}
        >
          <Link to="/admin/gallery" style={buttonStyle}>
            Manage Gallery
          </Link>

          <Link to="/admin/bookings" style={buttonStyle}>
            Manage Bookings
          </Link>

          <Link to="/admin/completed" style={buttonStyle}>
            Completed Jobs
          </Link>

          <Link to="/admin/products" style={buttonStyle}>
            Manage Products
          </Link>

          <Link to="/admin/reviews" style={buttonStyle}>
            Manage Reviews
          </Link>

          <Link to="/" style={buttonStyle}>
            Website Home
          </Link>

          <button
            type="button"
            onClick={logout}
            style={{
              ...buttonStyle,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <article
      style={{
        background: "#151515",
        padding: 25,
        borderRadius: 15,
        textAlign: "center",
        border: "1px solid rgba(255,255,255,.07)",
        overflowWrap: "anywhere",
      }}
    >
      <h3
        style={{
          color: "#ddd",
          marginTop: 0,
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: "#00ff88",
          fontSize: 36,
          marginBottom: 0,
        }}
      >
        {value ?? 0}
      </h1>
    </article>
  );
}

const buttonStyle = {
  display: "inline-block",
  background: "#ff3b3b",
  color: "#fff",
  padding: "13px 20px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: 14,
};

