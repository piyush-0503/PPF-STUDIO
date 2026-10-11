import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://ppf-studio-backend-2026.onrender.com";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  // Load reviews from live backend
  const loadReviews = async () => {
    try {
      setError("");

      const res = await axios.get(
        `${API_URL}/api/reviews`
      );

      const data = res.data;

      setReviews(
        Array.isArray(data)
          ? data
          : data.reviews || []
      );
    } catch (err) {
      console.error(
        "Load reviews error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Reviews load nahi hui. Backend API check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Delete review
  const deleteReview = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is review ko permanently delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await axios.delete(
        `${API_URL}/api/reviews/${id}`
      );

      setReviews((prev) =>
        prev.filter((review) => review._id !== id)
      );

      alert("Review Deleted Successfully ✅");
    } catch (err) {
      console.error(
        "Delete review error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Review delete nahi hui. Backend route check karo."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div
      style={{
        background: "#0b0b0b",
        minHeight: "100vh",
        color: "white",
        padding:
          window.innerWidth < 768 ? "18px" : "40px",
        paddingTop:
          window.innerWidth < 768 ? "90px" : "120px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize:
              window.innerWidth < 768 ? "30px" : "42px",
            fontWeight: "800",
            marginBottom: "30px",
            background:
              "linear-gradient(90deg,#FFD700,#ff8c00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ⭐ Admin Reviews
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          <p style={{ color: "#ccc" }}>
            Total Reviews: {reviews.length}
          </p>

          <button
            type="button"
            onClick={loadReviews}
            disabled={loading}
            style={{
              background: "#FFD700",
              color: "#111",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ↻ Refresh
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
              marginBottom: "20px",
              overflowWrap: "anywhere",
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <p style={{ textAlign: "center", color: "#ccc" }}>
            Loading reviews...
          </p>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div
            style={{
              background: "#151515",
              padding: "30px 20px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#aaa",
            }}
          >
            Abhi koi review available nahi hai.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(100%,280px),1fr))",
            gap: "20px",
          }}
        >
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                background: "#151515",
                padding: "22px",
                borderRadius: "14px",
                border:
                  "1px solid rgba(255,215,0,0.15)",
                boxShadow:
                  "0 0 20px rgba(255,215,0,0.04)",
                overflowWrap: "anywhere",
              }}
            >
              <h3
                style={{
                  color: "#FFD700",
                  marginTop: 0,
                  marginBottom: "12px",
                }}
              >
                {review.customerName || "Customer"}
              </h3>

              <p style={{ color: "#ffca28" }}>
                ⭐ {review.rating ?? "N/A"} / 5
              </p>

              <p
                style={{
                  color: "#ddd",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                }}
              >
                {review.comment || "No comment provided."}
              </p>

              <button
                type="button"
                onClick={() => deleteReview(review._id)}
                disabled={deletingId === review._id}
                style={{
                  marginTop: "12px",
                  background: "#ff1744",
                  border: "none",
                  color: "#fff",
                  padding: "11px 18px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontWeight: "700",
                  opacity:
                    deletingId === review._id ? 0.6 : 1,
                }}
              >
                {deletingId === review._id
                  ? "Deleting..."
                  : "🗑 Delete Review"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

