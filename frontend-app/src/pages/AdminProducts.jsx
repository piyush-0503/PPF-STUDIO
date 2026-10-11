import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://ppf-studio-backend-2026.onrender.com";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/400x250?text=PPF+Studio";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
  });

  // Fetch products from live backend
  const fetchProducts = async () => {
    try {
      setError("");

      const res = await axios.get(
        `${API_URL}/api/products`
      );

      const data = res.data;

      setProducts(
        Array.isArray(data)
          ? data
          : data.products || []
      );
    } catch (err) {
      console.error(
        "Fetch products error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Products load nahi hue. Backend API check karo."
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Upload product image
  const uploadImage = async () => {
    if (!imageFile) return "";

    const data = new FormData();
    data.append("image", imageFile);

    const res = await axios.post(
      `${API_URL}/api/upload/image`,
      data
    );

    if (!res.data?.imageUrl) {
      throw new Error(
        "Image upload response mein imageUrl nahi mila."
      );
    }

    return res.data.imageUrl;
  };

  // Add product
  const addProduct = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.stock) {
      alert("Product name, price aur stock fill karo.");
      return;
    }

    if (
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0 ||
      !Number.isFinite(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      alert("Valid price aur stock enter karo.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        image: imageUrl,
      };

      await axios.post(
        `${API_URL}/api/products`,
        productData
      );

      alert("Product Added Successfully ✅");

      setForm({
        name: "",
        brand: "",
        price: "",
        stock: "",
        description: "",
      });

      setImageFile(null);

      const fileInput = document.getElementById(
        "product-image"
      );

      if (fileInput) fileInput.value = "";

      await fetchProducts();
    } catch (err) {
      console.error(
        "Add product error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          err.message ||
          "Product add nahi hua. Backend check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      setError("");

      await axios.delete(
        `${API_URL}/api/products/${id}`
      );

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Product Deleted Successfully ✅");
    } catch (err) {
      console.error(
        "Delete product error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Product delete nahi hua. Backend route check karo."
      );
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    background: "#1a1a1a",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "10px",
    fontSize: "15px",
  };

  const buttonStyle = {
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding:
          window.innerWidth < 768 ? "15px" : "30px",
        paddingTop:
          window.innerWidth < 768 ? "90px" : "120px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize:
              window.innerWidth < 768 ? "34px" : "55px",
            fontWeight: "800",
            marginBottom: "40px",
            lineHeight: "1.3",
            background:
              "linear-gradient(90deg,#FFD700,#ff8c00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🛒 PPF Store Products
        </h1>

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

        {/* Add product form */}
        <form
          onSubmit={addProduct}
          style={{
            background: "#111",
            padding:
              window.innerWidth < 768 ? "18px" : "30px",
            borderRadius: "20px",
            marginBottom: "40px",
            border: "1px solid rgba(255,215,0,0.15)",
            boxShadow: "0 0 30px rgba(255,215,0,0.12)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(min(100%,240px),1fr))",
              gap: "15px",
            }}
          >
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              style={inputStyle}
              required
            />

            <input
              placeholder="Brand"
              value={form.brand}
              onChange={(e) =>
                setForm({
                  ...form,
                  brand: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
              style={inputStyle}
              required
            />

            <input
              type="number"
              min="0"
              step="1"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value,
                })
              }
              style={inputStyle}
              required
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
              style={{
                ...inputStyle,
                padding: "10px",
              }}
            />
          </div>

          {imageFile && (
            <p style={{ color: "#ccc", fontSize: "13px" }}>
              Selected image: {imageFile.name}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              marginTop: "20px",
              background:
                "linear-gradient(90deg,#FFD700,#ff9900)",
              color: "#111",
              fontSize: "16px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>

        {/* Products list */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(min(100%,300px),1fr))",
            gap: "25px",
          }}
        >
          {fetchLoading && (
            <p>Loading products...</p>
          )}

          {!fetchLoading && products.length === 0 && !error && (
            <p>No products added yet.</p>
          )}

          {products.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#111",
                borderRadius: "18px",
                overflow: "hidden",
                border: "1px solid rgba(255,215,0,0.15)",
                boxShadow: "0 0 20px rgba(255,215,0,0.08)",
              }}
            >
              <img
                src={item.image || PLACEHOLDER_IMAGE}
                alt={item.name || "PPF Studio product"}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
                style={{
                  width: "100%",
                  height: "240px",
                  objectFit: "cover",
                  background: "#1a1a1a",
                }}
              />

              <div style={{ padding: "20px" }}>
                <h2>{item.name}</h2>

                <p>
                  Brand: <strong>{item.brand || "N/A"}</strong>
                </p>

                <h2 style={{ color: "#00e676" }}>
                  ₹{item.price ?? 0}
                </h2>

                <p>
                  Stock: <strong>{item.stock ?? 0}</strong>
                </p>

                <p style={{ overflowWrap: "anywhere" }}>
                  {item.description || "No description available."}
                </p>

                <button
                  type="button"
                  onClick={() => deleteProduct(item._id)}
                  style={{
                    ...buttonStyle,
                    marginTop: "10px",
                    background: "#ff1744",
                    color: "#fff",
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

