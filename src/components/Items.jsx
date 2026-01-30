import { useEffect, useRef, useState } from "react";


export function Items() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function loadItems() {
    try {
      const response = await fetch("http://localhost:3000/api/item");
      const data = await response.json();
      console.log("==> data : ", data);
      setItems(data);
    } catch (err) {
      console.log("==> err : ", err);
      alert("Loading items failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function onItemSave() {
    if (!itemNameRef.current.value || !itemPriceRef.current.value) {
      alert("Please fill in all fields");
      return;
    }

    const uri = "http://localhost:3000/api/item";
    const body = {
      name: itemNameRef.current.value,
      category: itemCategoryRef.current.value,
      price: itemPriceRef.current.value,
    };

    try {
      const result = await fetch(uri, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await result.json();
      console.log("==> data: ", data);
      itemNameRef.current.value = "";
      itemPriceRef.current.value = "";
      loadItems();
    } catch (err) {
      alert("Failed to add item");
    }
  }

  useEffect(() => {
    console.log("==> Init...");
    loadItems();
  }, []);

  if (isLoading) return <div className="loading">Loading items...</div>;

  return (
    <div className="items-container">
      <h1>📦 Item Management</h1>
      <div className="table-wrapper">
        <table className="items-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td className="name-cell">{item.itemName}</td>
                <td><span className="category-badge">{item.itemCategory}</span></td>
                <td className="price-cell">${item.itemPrice}</td>
                <td><a href={`/items/${item._id}`} className="edit-link">Edit</a></td>
              </tr>
            ))}
            <tr className="add-row">
              <td>-</td>
              <td><input type="text" ref={itemNameRef} placeholder="Item name" /></td>
              <td>
                <select ref={itemCategoryRef}>
                  <option>Stationary</option>
                  <option>Kitchenware</option>
                  <option>Appliance</option>
                </select>
              </td>
              <td><input type="number" ref={itemPriceRef} placeholder="0.00" step="0.01" /></td>
              <td><button onClick={onItemSave} className="btn-add">Add Item</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}