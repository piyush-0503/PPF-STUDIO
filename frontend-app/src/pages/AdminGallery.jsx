import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://ppf-studio-backend-2026.onrender.com/api";

const BACKEND_URL =
  "https://ppf-studio-backend-2026.onrender.com";

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);

  const [title, setTitle] = useState("");
  const [carName, setCarName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadGallery = useCallback(async () => {
    try {
      setError("");

      const res = await axios.get(`${API_URL}/gallery`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.gallery || [];

      setGallery(data);
    } catch (err) {
      console.error("Gallery loading error:", err);
      setError("Gallery load nahi hui. Backend API check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    if (!image.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      alert("Image size 5 MB se kam honi chahiye.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("carName", carName.trim());
      formData.append("description", description.trim());
      formData.append("image", image);

      await axios.post(`${API_URL}/gallery`, formData);

      alert("Image uploaded successfully!");

      setTitle("");
      setCarName("");
      setDescription("");
      setImage(null);

      const fileInput = document.getElementById("gallery-image");
      if (fileInput) fileInput.value = "";

      await loadGallery();
    } catch (err) {
      console.error("Gallery upload error:", err);

      alert(
        err.response?.data?.message ||
          "Upload failed. Backend upload route aur file storage check karein."
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await axios.delete(`${API_URL}/gallery/${id}`);

      setGallery((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Image deleted successfully.");
    } catch (err) {
      console.error("Gallery delete error:", err);

      alert(
        err.response?.data?.message ||
          "Delete failed. Backend delete route check karein."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getImageUrl = (item) => {
    // Supports full URLs, such as ImageKit CDN URLs.
    if (item.imageUrl) return item.imageUrl;
    if (item.image && /^https?:\/\//i.test(item.image)) {
      return item.image;
    }

    // Supports older backend records saved as local filenames.
    if (item.image) {
      return `${BACKEND_URL}/uploads/${encodeURIComponent(item.image)}`;
    }

    return "";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        background: "#0b0b0b",
        color: "white",
        padding: "30px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            color: "#ff3b3b",
            marginBottom: "30px",
          }}
        >
          Admin Gallery
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#151515",
            padding: "25px",
            borderRadius: "10px",
            marginBottom: "40px",
          }}
        >
          <input
            type="text"
            placeholder="Image Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            maxLength={100}
            required
          />

          <input
            type="text"
            placeholder="Car or Bike Name"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            style={inputStyle}
            maxLength={100}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              ...inputStyle,
              minHeight: "120px",
              resize: "vertical",
            }}
            maxLength={1000}
          />

          <label
            htmlFor="gallery-image"
            style={{
              display: "block",
              marginBottom: "10px",
            }}
          >
            Select Image (maximum 5 MB)
          </label>

          <input
            id="gallery-image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
            style={{
              display: "block",
              marginBottom: "20px",
              maxWidth: "100%",
            }}
            required
          />

          {image && (
            <p style={{ color: "#bbb" }}>
              Selected: {image.name}
            </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            style={{
              background: uploading ? "#777" : "#ff3b3b",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "8px",
              cursor: uploading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>

        <h2
          style={{
            color: "#ff3b3b",
            marginBottom: "20px",
          }}
        >
          Gallery Images
        </h2>

        {loading && <p>Loading gallery...</p>}

        {!loading && error && (
          <div>
            <p style={{ color: "#ff7777" }}>{error}</p>
            <button onClick={loadGallery}>Try Again</button>
          </div>
        )}

        {!loading && !error && gallery.length === 0 && (
          <p>No gallery images found. Upload your first image.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "20px",
          }}
        >
          {!error &&
            gallery.map((item) => {
              const imageUrl = getImageUrl(item);

              return (
                <div
                  key={item._id}
                  style={{
                    background: "#151515",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #292929",
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title || "PPF Studio gallery"}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "250px",
                        display: "grid",
                        placeItems: "center",
                        color: "#aaa",
                      }}
                    >
                      Image URL unavailable
                    </div>
                  )}

                  <div style={{ padding: "15px" }}>
                    <h3>{item.title}</h3>
                    <p>{item.carName}</p>
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {item.description}
                    </p>

                    <button
                      type="button"
                      disabled={deletingId === item._id}
                      onClick={() => deleteImage(item._id)}
                      style={{
                        background:
                          deletingId === item._id ? "#777" : "#ff3b3b",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        cursor:
                          deletingId === item._id
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {deletingId === item._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginBottom: "15px",
  background: "#222",
  color: "white",
  border: "1px solid #333",
  borderRadius: "8px",
  fontSize: "15px",
};

