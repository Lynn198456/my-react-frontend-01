import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function ItemDetail () {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function loadItem () {
    try {
      const uri = `http://localhost:3000/api/item/${id}`;
      console.log("==> uri: ", uri);
      const result = await fetch(uri);
      const data = await result.json();
      console.log("==> data :", data);
      itemNameRef.current.value = data.itemName;
      itemCategoryRef.current.value = data.itemCategory;
      itemPriceRef.current.value = data.itemPrice;
    } catch (err) {
      console.error("Failed to load item:", err);
      alert("Failed to load item details");
    } finally {
      setIsLoading(false);
    }
  }

  async function onUpdate () {
    if (!itemNameRef.current.value || !itemPriceRef.current.value) {
      alert("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    const body = {
      name: itemNameRef.current.value,
      category: itemCategoryRef.current.value,
      price: itemPriceRef.current.value
    };
    
    try {
      const uri = `http://localhost:3000/api/item/${id}`;
      console.log("==> uri: ", uri);
      const result = await fetch(uri, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      if (result.status === 200) {
        alert("Item updated successfully!");
        loadItem();
      } else {
        alert("Failed to update item");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating item");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    loadItem();
  }, [id]);

  if (isLoading) return <div className="loading">Loading item details...</div>;

  return (
    <div className="item-detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <h1>✏️ Edit Item</h1>
          <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        </div>

        <form className="detail-form" onSubmit={(e) => { e.preventDefault(); onUpdate(); }}>
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              id="itemName"
              type="text"
              ref={itemNameRef}
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="itemCategory">Category</label>
            <select id="itemCategory" ref={itemCategoryRef}>
              <option>Stationary</option>
              <option>Kitchenware</option>
              <option>Appliance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="itemPrice">Price</label>
            <input
              id="itemPrice"
              type="number"
              ref={itemPriceRef}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-update" disabled={isSaving}>
              {isSaving ? "Saving..." : "Update Item"}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}