import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getApiBaseUrl } from "../lib/apiBase";

const API_URL = `${getApiBaseUrl()}/api/item`;
const ITEMS_PER_PAGE = 10;

export default function Items() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function loadItems(p = 1) {
    try {
      const res = await fetch(`${API_URL}?page=${p}&limit=${ITEMS_PER_PAGE}`);
      const json = await res.json();

      // json is an OBJECT: { data: [], page, totalPages, ... }
      setItems(json.data || []);
      setPage(json.page || p);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.log("==> err : ", err);
      alert("Loading items failed");
    }
  }

  async function onItemSave() {
    const uri = API_URL;

    const body = {
      itemName: itemNameRef.current.value,
      itemCategory: itemCategoryRef.current.value,
      itemPrice: Number(itemPriceRef.current.value),
      status: "ACTIVE",
    };

    if (!body.itemName.trim() || !body.itemCategory.trim() || Number.isNaN(body.itemPrice)) {
      alert("Please fill Item Name, Category, and valid Price");
      return;
    }

    const result = await fetch(uri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await result.json().catch(() => ({}));
    if (!result.ok) {
      alert(json?.message || "Create failed");
      return;
    }

    // Clear form
    itemNameRef.current.value = "";
    itemCategoryRef.current.value = "Stationary";
    itemPriceRef.current.value = "";

    // Reload first page so you can see the newest item
    loadItems(1);
  }

  async function onDeleteItem(id, name) {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const uri = `${API_URL}/${id}`;
      const result = await fetch(uri, { method: "DELETE" });
      const json = await result.json().catch(() => ({}));

      if (!result.ok) {
        alert(json?.message || "Failed to delete item");
        return;
      }

      alert("Item deleted successfully");

      // Reload current page (or previous if last item removed)
      const shouldGoBack = items.length === 1 && page > 1;
      const nextPage = shouldGoBack ? page - 1 : page;
      loadItems(nextPage);
    } catch (err) {
      console.log("==> err : ", err);
      alert("Error deleting item");
    }
  }

  useEffect(() => {
    loadItems(1);
  }, []);

  return (
    <>
      <h1>Item Management</h1>
      <p>
        Page {page} of {totalPages} | Showing {items.length} item(s)
      </p>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>THB {Number(item.itemPrice).toFixed(2)}</td>
              <td>{item.status}</td>
              <td>
                <Link to={`/items/${item._id}`}>Edit</Link>
                {" | "}
                <button onClick={() => onDeleteItem(item._id, item.itemName)}>Delete</button>
              </td>
            </tr>
          ))}

          {/* Add new item row */}
          <tr>
            <td>-</td>
            <td>
              <input type="text" ref={itemNameRef} placeholder="Item name" />
            </td>
            <td>
              <select ref={itemCategoryRef} defaultValue="Stationary">
                <option>Stationary</option>
                <option>Kitchenware</option>
                <option>Appliance</option>
              </select>
            </td>
            <td>
              <input type="text" ref={itemPriceRef} placeholder="Price" />
            </td>
            <td>ACTIVE</td>
            <td>
              <button onClick={onItemSave}>Add Item</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => loadItems(page - 1)} disabled={page === 1} style={{ marginRight: "10px" }}>
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page <b>{page}</b> / {totalPages}
        </span>

        <button onClick={() => loadItems(page + 1)} disabled={page === totalPages} style={{ marginLeft: "10px" }}>
          Next
        </button>
      </div>

      <div style={{ marginTop: 15, textAlign: "center" }}>
        <Link to="/items/new">Create in Form Page</Link>
      </div>
    </>
  );
}
