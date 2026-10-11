import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL =
  "https://ppf-studio-backend-2026.onrender.com/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const [form, setForm] = useState({
    customerName: "",
    rating: "5",
    comment: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch reviews from live backend
  const fetchReviews = useCallback(async () => {
    try {
      setError("");

      const response = await axios.get(`${API_URL}/reviews`);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.reviews || [];

      setReviews(data);
    } catch (err) {
      console.error("Fetch reviews error:", err);

      setError(
        "Reviews load nahi ho rahe. Please backend connection check karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
  };

  // Submit customer review
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const customerName = form.customerName.trim();
    const comment = form.comment.trim();
    const rating = Number(form.rating);

    if (!customerName || !comment) {
      setError("Please name aur review comment fill karein.");
      return;
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      setError("Please 1 se 5 ke beech rating select karein.");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${API_URL}/reviews`, {
        customerName,
        rating,
        comment,
      });

      setForm({
        customerName: "",
        rating: "5",
        comment: "",
      });

      setSuccess("Thank you! Your review has been submitted.");

      await fetchReviews();
    } catch (err) {
      console.error("Submit review error:", err);

      setError(
        err.response?.data?.message ||
          "Review submit nahi hua. Please dobara try karein."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Safely display rating stars
  const renderStars = (value) => {
    const rating = Math.min(
      5,
      Math.max(0, Number(value) || 0)
    );

    return (
      <span
        style={{
          color: "#f5a623",
          letterSpacing: "2px",
        }}
      >
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </span>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page Heading */}
        <div style={styles.header}>
          <p style={styles.tagline}>PPF STUDIO</p>

          <h1 style={styles.heading}>Customer Reviews</h1>

          <p style={styles.subtitle}>
            Share your experience with PPF Studio and help
            other customers choose the right service.
          </p>
        </div>

        {/* Review Form */}
        <section style={styles.formCard}>
          <h2 style={styles.sectionHeading}>
            Write a Review
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label htmlFor="customerName" style={styles.label}>
              Your Name
            </label>

            <input
              id="customerName"
              type="text"
              name="customerName"
              placeholder="Enter your name"
              value={form.customerName}
              onChange={handleChange}
              maxLength={80}
              autoComplete="name"
              required
              style={styles.input}
            />

            <label htmlFor="rating" style={styles.label}>
              Your Rating
            </label>

            <select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>

            <div style={{ marginTop: "-5px" }}>
              {renderStars(form.rating)}
            </div>

            <label htmlFor="comment" style={styles.label}>
              Your Experience
            </label>

            <textarea
              id="comment"
              name="comment"
              placeholder="Tell us about your experience..."
              value={form.comment}
              onChange={handleChange}
              maxLength={1000}
              rows={5}
              required
              style={{
                ...styles.input,
                resize: "vertical",
                minHeight: "120px",
              }}
            />

            <p style={styles.characterCount}>
              {form.comment.length}/1000 characters
            </p>

            {error && (
              <p role="alert" style={styles.error}>
                {error}
              </p>
            )}

            {success && (
              <p role="status" style={styles.success}>
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </section>

        {/* Customer Reviews List */}
        <section style={styles.reviewsSection}>
          <h2 style={styles.sectionHeading}>
            What Our Customers Say
          </h2>

          {loading && (
            <p style={styles.info}>Loading reviews...</p>
          )}

          {!loading && error && reviews.length === 0 && (
            <div style={styles.messageCard}>
              <p style={styles.error}>{error}</p>

              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  fetchReviews();
                }}
                style={styles.retryButton}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && reviews.length === 0 && (
            <div style={styles.messageCard}>
              <p style={styles.info}>
                No reviews yet. Be the first to share your
                experience!
              </p>
            </div>
          )}

          <div style={styles.reviewGrid}>
            {reviews.map((review) => (
              <article
                key={review._id}
                style={styles.reviewCard}
              >
                <div style={styles.reviewTop}>
                  <div style={styles.avatar}>
                    {(review.customerName || "C")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3 style={styles.customerName}>
                      {review.customerName || "Customer"}
                    </h3>

                    {renderStars(review.rating)}
                  </div>
                </div>

                <p style={styles.comment}>
                  {review.comment}
                </p>

                <p style={styles.ratingText}>
                  Rating: {Number(review.rating) || 0}/5
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    boxSizing: "border-box",
    background: "#0b0b0b",
    color: "#ffffff",
    padding: "40px 20px 60px",
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    width: "100%",
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  tagline: {
    color: "#f5a623",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "4px",
  },

  heading: {
    color: "#ff3b3b",
    fontSize: "clamp(28px, 5vw, 42px)",
    margin: "10px 0",
  },

  subtitle: {
    color: "#bdbdbd",
    lineHeight: 1.7,
    maxWidth: "600px",
    margin: "0 auto",
  },

  formCard: {
    background: "#151515",
    border: "1px solid #303030",
    borderRadius: "14px",
    padding: "clamp(18px, 4vw, 30px)",
    maxWidth: "600px",
    margin: "0 auto 50px",
    boxSizing: "border-box",
  },

  sectionHeading: {
    fontSize: "24px",
    marginTop: 0,
    marginBottom: "22px",
    color: "#ffffff",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  label: {
    fontSize: "14px",
    color: "#dddddd",
    fontWeight: "600",
    marginTop: "5px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #444",
    borderRadius: "7px",
    background: "#222",
    color: "#ffffff",
    fontSize: "15px",
    outlineColor: "#f5a623",
  },

  characterCount: {
    color: "#888",
    textAlign: "right",
    fontSize: "12px",
    margin: "-7px 0 0",
  },

  button: {
    padding: "14px 20px",
    background: "#f5a623",
    color: "#111111",
    border: "none",
    borderRadius: "7px",
    fontSize: "15px",
    fontWeight: "bold",
    marginTop: "8px",
  },

  error: {
    color: "#ff7777",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  success: {
    color: "#4ade80",
    lineHeight: 1.5,
  },

  reviewsSection: {
    marginTop: "20px",
  },

  reviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
    gap: "18px",
  },

  reviewCard: {
    background: "#151515",
    border: "1px solid #303030",
    borderRadius: "12px",
    padding: "20px",
    minWidth: 0,
    overflowWrap: "anywhere",
  },

  reviewTop: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "18px",
  },

  avatar: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "50%",
    background: "#292929",
    color: "#f5a623",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },

  customerName: {
    fontSize: "17px",
    margin: "0 0 7px",
    color: "#ffffff",
  },

  comment: {
    color: "#cccccc",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },

  ratingText: {
    color: "#888888",
    fontSize: "12px",
    marginBottom: 0,
  },

  info: {
    color: "#bbbbbb",
    lineHeight: 1.6,
  },

  messageCard: {
    background: "#151515",
    border: "1px solid #303030",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
  },

  retryButton: {
    padding: "10px 18px",
    background: "#333",
    color: "#ffffff",
    border: "1px solid #555",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

