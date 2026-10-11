import { useState } from "react";
import axios from "axios";

const API_URL =
  "https://ppf-studio-backend-2026.onrender.com/api";

export default function TrackBooking() {
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooking = async (e) => {
    e.preventDefault();

    const cleanPhone = phone.trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      setBooking(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBooking(null);

      const res = await axios.get(`${API_URL}/bookings`);

      // Backend array ya { bookings: [...] } dono handle honge
      const bookings = Array.isArray(res.data)
        ? res.data
        : res.data?.bookings || [];

      const found = bookings.find(
        (b) => String(b.phone || "").trim() === cleanPhone
      );

      if (found) {
        setBooking(found);
      } else {
        setError(
          "Booking nahi mili. Wahi mobile number enter karein jo booking ke time use kiya tha."
        );
      }
    } catch (err) {
      console.error("Booking search error:", err);

      setError(
        err.response?.status === 404
          ? "Booking API route nahi mila. Backend route check karein."
          : "Booking search nahi ho paayi. Please thodi der baad try karein."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Pending: "#ffb020",
    Confirmed: "#38bdf8",
    "In Progress": "#a78bfa",
    Completed: "#22c55e",
    Cancelled: "#f87171",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        background: "#0b0b0b",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ color: "#ff3b3b" }}>
          Track Your Booking
        </h1>

        <p style={{ color: "#bbb" }}>
          Apni PPF Studio booking ka status check karne ke
          liye registered mobile number enter karein.
        </p>

        <form
          onSubmit={searchBooking}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            maxLength={10}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ""));
              setError("");
              setBooking(null);
            }}
            required
            style={{
              flex: "1 1 250px",
              minWidth: 0,
              padding: "13px",
              boxSizing: "border-box",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#1a1a1a",
              color: "white",
              fontSize: "15px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px 22px",
              border: "none",
              borderRadius: "6px",
              background: loading ? "#777" : "#ff3b3b",
              color: "white",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Searching..." : "Search Booking"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            style={{
              color: "#ff7777",
              marginTop: "20px",
            }}
          >
            {error}
          </p>
        )}

        {booking && (
          <div
            style={{
              marginTop: "30px",
              background: "#151515",
              border: "1px solid #333",
              padding: "22px",
              borderRadius: "12px",
              overflowWrap: "anywhere",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {booking.customerName}
            </h2>

            <p>
              <strong>Phone:</strong> {booking.phone}
            </p>

            <p>
              <strong>Vehicle:</strong>{" "}
              {[booking.brand, booking.vehicleModel]
                .filter(Boolean)
                .join(" ") || "Not specified"}
            </p>

            <p>
              <strong>Service:</strong>{" "}
              {booking.serviceType || "Not specified"}
            </p>

            <p>
              <strong>Booking Date:</strong>{" "}
              {booking.bookingDate
                ? new Date(booking.bookingDate).toLocaleDateString("en-IN")
                : "Not specified"}
            </p>

            {booking.slotDate && (
              <p>
                <strong>Service Slot Date:</strong>{" "}
                {new Date(booking.slotDate).toLocaleDateString("en-IN")}
              </p>
            )}

            {booking.slotTime && (
              <p>
                <strong>Slot Time:</strong> {booking.slotTime}
              </p>
            )}

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    statusColors[booking.status] || "#f5a623",
                  fontWeight: "bold",
                }}
              >
                {booking.status || "Pending"}
              </span>
            </p>

            <p>
              <strong>Estimated Price:</strong>{" "}
              ₹
              {Number(booking.estimatedPrice || 0).toLocaleString(
                "en-IN"
              )}
            </p>

            <p style={{ color: "#999", fontSize: "13px" }}>
              Note: Estimated price final bill se different ho sakta hai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

