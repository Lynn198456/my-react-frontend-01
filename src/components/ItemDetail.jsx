import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api/item";

export default function ItemDetail() {
  const { id } = useParams(); // undefined for new
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    itemCategory: "Stationary",
    itemPrice: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          itemName: data.itemName ?? "",
          itemCategory: data.itemCategory ?? "Stationary",
          itemPrice: data.itemPrice ?? "",
          status: data.status ?? "ACTIVE",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const body = {
      itemName: form.itemName,
      itemCategory: form.itemCategory,
      itemPrice: Number(form.itemPrice),
      status: form.status,
    };

    if (!body.itemName.trim() || !body.itemCategory.trim() || Number.isNaN(body.itemPrice)) {
      alert("Please fill Item Name, Category, and valid Price");
      return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(json?.message || "Save failed");
      return;
    }

    alert(id ? "Updated successfully" : "Created successfully");
    navigate("/items");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{id ? "Edit Item" : "New Item"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 400 }}>
        <input
          placeholder="Item Name"
          value={form.itemName}
          onChange={(e) => setForm({ ...form, itemName: e.target.value })}
        />

        <select value={form.itemCategory} onChange={(e) => setForm({ ...form, itemCategory: e.target.value })}>
          <option>Stationary</option>
          <option>Kitchenware</option>
          <option>Appliance</option>
        </select>

        <input
          placeholder="Price"
          value={form.itemPrice}
          onChange={(e) => setForm({ ...form, itemPrice: e.target.value })}
        />

        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button type="submit">{id ? "Update" : "Create"}</button>
        <Link to="/items">Back</Link>
      </form>
    </div>
  );
}
