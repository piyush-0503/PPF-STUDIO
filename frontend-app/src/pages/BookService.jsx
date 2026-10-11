import { useState } from "react";
import axios from "axios";

const API_BASE_URL =
  (
    import.meta.env.VITE_API_URL ||
    "https://ppf-studio-backend-2026.onrender.com"
  ).replace(/\/+$/, "");

const servicesList = [
  "PPF",
  "Ceramic Coating",
  "Graphene Coating",
  "Car Wrapping",
  "Paint Correction",
  "Detailing",
  "Interior Detailing",
  "Bike PPF",
  "Bike Ceramic",
];

const inputStyle = {
  width: "100%",
  minWidth: 0,
  padding: "14px 15px",
  marginBottom: "15px",
  background: "#1a1a1a",
  color: "#fff",
  border: "1px solid #383838",
  borderRadius: "10px",
  fontSize: "16px",
  boxSizing: "border-box",
};

const initialForm = {
  name: "",
  phone: "",
  email: "",
  state: "",
  city: "",
  vehicleType: "Car",
  brand: "",
  model: "",
  service: "",
  slotDate: "",
};

export default function BookService() {
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState(initialForm);

  const today = new Date();

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const whatsappMessage = `Hello PPF Studio,

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Location: ${form.city}, ${form.state}
Vehicle Type: ${form.vehicleType}
Brand: ${form.brand}
Model: ${form.model}
Service: ${form.service}
Preferred Date: ${form.slotDate}

Please confirm availability and final pricing.`;

  const whatsappLink =
    "https://wa.me/917570908459?text=" +
    encodeURIComponent(whatsappMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrorMessage("");
    setBookingResult(null);

    if (!servicesList.includes(form.service)) {
      setErrorMessage("Please select a valid service.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setErrorMessage(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (form.slotDate < minDate) {
      setErrorMessage(
        "Please select today or a future date."
      );
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        vehicleType: form.vehicleType,
        brand: form.brand.trim(),
        vehicleModel: form.model.trim(),
        serviceType: form.service,
        bookingDate: form.slotDate,
        slotDate: form.slotDate,
        slotTime: "Not Selected",
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setBookingResult(
          response.data?.booking || response.data
        );

        setForm({ ...initialForm });
      }
    } catch (error) {
      console.error(
        "Booking submission error:",
        error.response?.data || error.message
      );

      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      if (error.response) {
        setErrorMessage(
          serverMessage ||
            `Server error (${error.response.status}). Please check your backend.`
        );
      } else if (error.code === "ECONNABORTED") {
        setErrorMessage(
          "Server response timed out. Please try again."
        );
      } else {
        setErrorMessage(
          `Backend connection failed. Check API URL: ${API_BASE_URL}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <style>{`
        .booking-page,
        .booking-page * {
          box-sizing: border-box;
        }

        .booking-page {
          min-height: 100vh;
          width: 100%;
          overflow-x: clip;
          padding: 45px 18px 60px;
          background: radial-gradient(circle at top,#2b0018,#050505);
          color: #fff;
        }

        .booking-title {
          text-align: center;
          font-size: clamp(32px,5vw,58px);
          line-height: 1.2;
          margin: 20px auto 38px;
          overflow-wrap: anywhere;
          background: linear-gradient(90deg,#FFD700,#FF7A00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .booking-layout {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0,1.15fr) minmax(0,.85fr);
          align-items: start;
          gap: 25px;
        }

        .booking-panel {
          min-width: 0;
          padding: clamp(18px,3vw,32px);
          background: #111;
          border: 1px solid rgba(255,215,0,.18);
          border-radius: 20px;
          box-shadow: 0 0 30px rgba(255,215,0,.06);
        }

        .booking-panel h2 {
          color: #FFD700;
          text-align: center;
          margin: 0 0 24px;
          font-size: clamp(22px,3vw,28px);
        }

        .booking-field-label {
          display: block;
          color: #ddd;
          font-size: 14px;
          margin-bottom: 7px;
        }

        .booking-error,
        .booking-success {
          margin-bottom: 18px;
          padding: 13px;
          border-radius: 10px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .booking-error {
          border: 1px solid #b83c4b;
          background: #32151b;
          color: #ffb7c0;
        }

        .booking-success {
          border: 1px solid #218c54;
          background: #10271a;
          color: #a8f0c4;
        }

        .booking-submit {
          width: 100%;
          min-height: 50px;
          padding: 14px;
          margin-top: 6px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg,#ff0000,#ff9800);
          color: white;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
        }

        .booking-submit:disabled {
          opacity: .65;
          cursor: wait;
        }

        .booking-summary-row {
          margin-bottom: 12px;
          color: #ddd;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }

        .booking-summary-row strong {
          color: #fff;
        }

        .booking-whatsapp {
          display: block;
          width: 100%;
          padding: 15px;
          margin-top: 25px;
          border-radius: 10px;
          background: #25D366;
          color: #fff;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
        }

        @media(max-width:800px) {
          .booking-layout {
            grid-template-columns: minmax(0,1fr);
          }

          .booking-page {
            padding: 28px 14px 40px;
          }
        }
      `}</style>

      <h1 className="booking-title">
        Book Your Appointment
      </h1>

      <div className="booking-layout">
        <form
          className="booking-panel"
          onSubmit={handleSubmit}
        >
          <h2>Customer & Vehicle Details</h2>

          {errorMessage && (
            <div className="booking-error" role="alert">
              <strong>Booking failed:</strong> {errorMessage}
            </div>
          )}

          {bookingResult && (
            <div className="booking-success" role="status">
              <strong>Booking request submitted successfully!</strong>
              <p>
                Please wait for the studio to confirm your appointment.
              </p>
              {bookingResult._id && (
                <p>Booking ID: {bookingResult._id}</p>
              )}
            </div>
          )}

          <label className="booking-field-label" htmlFor="booking-name">
            Customer Name
          </label>
          <input
            id="booking-name"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
            autoComplete="name"
            required
          />

          <label className="booking-field-label" htmlFor="booking-phone">
            Phone Number
          </label>
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="10-digit phone number"
            value={form.phone}
            onChange={handleChange}
            style={inputStyle}
            autoComplete="tel"
            required
          />

          <label className="booking-field-label" htmlFor="booking-email">
            Email Address
          </label>
          <input
            id="booking-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
            autoComplete="email"
            required
          />

          <label className="booking-field-label" htmlFor="booking-state">
            State / Region
          </label>
          <input
            id="booking-state"
            name="state"
            placeholder="Enter your state"
            value={form.state}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label className="booking-field-label" htmlFor="booking-city">
            City
          </label>
          <input
            id="booking-city"
            name="city"
            placeholder="Enter your city"
            value={form.city}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label className="booking-field-label" htmlFor="booking-vehicle">
            Vehicle Type
          </label>
          <select
            id="booking-vehicle"
            name="vehicleType"
            value={form.vehicleType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
          </select>

          <label className="booking-field-label" htmlFor="booking-brand">
            Vehicle Brand
          </label>
          <input
            id="booking-brand"
            name="brand"
            placeholder="e.g. Tata, Hyundai, BMW"
            value={form.brand}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label className="booking-field-label" htmlFor="booking-model">
            Vehicle Model
          </label>
          <input
            id="booking-model"
            name="model"
            placeholder="e.g. Nexon, Creta, X5"
            value={form.model}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label className="booking-field-label" htmlFor="booking-service">
            Select Service
          </label>
          <select
            id="booking-service"
            name="service"
            value={form.service}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Service</option>
            {servicesList.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>

          <label className="booking-field-label" htmlFor="booking-date">
            Preferred Appointment Date
          </label>
          <input
            id="booking-date"
            type="date"
            name="slotDate"
            min={minDate}
            value={form.slotDate}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            className="booking-submit"
            disabled={loading}
          >
            {loading ? "Submitting Booking..." : "Book Appointment"}
          </button>
        </form>

        <aside className="booking-panel">
          <h2>Booking Summary</h2>

          <p className="booking-summary-row">
            <strong>Name:</strong> {form.name || "Not entered"}
          </p>

          <p className="booking-summary-row">
            <strong>Phone:</strong> {form.phone || "Not entered"}
          </p>

          <p className="booking-summary-row">
            <strong>Location:</strong>{" "}
            {[form.city, form.state].filter(Boolean).join(", ") || "Not selected"}
          </p>

          <p className="booking-summary-row">
            <strong>Vehicle:</strong>{" "}
            {[form.brand, form.model].filter(Boolean).join(" ") || "Not entered"}
          </p>

          <p className="booking-summary-row">
            <strong>Vehicle Type:</strong> {form.vehicleType}
          </p>

          <p className="booking-summary-row">
            <strong>Service:</strong> {form.service || "Not selected"}
          </p>

          <p className="booking-summary-row">
            <strong>Date:</strong> {form.slotDate || "Not selected"}
          </p>

          <hr style={{ margin: "25px 0", borderColor: "#333" }} />

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="booking-whatsapp"
          >
            Confirm on WhatsApp
          </a>
        </aside>
      </div>
    </main>
  );
}

