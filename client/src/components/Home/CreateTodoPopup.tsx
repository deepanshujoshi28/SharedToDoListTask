import React, { useState } from "react";

const CreateTodoPopup = ({ fetchData, setCreateTodo }: { fetchData?: () => void; setCreateTodo: (val: boolean) => void }) => {
  const [data, setData] = useState({ title: "", description: "", sharedWith: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const sharedWithArray = data.sharedWith
    ? data.sharedWith.split(",").map((email) => email.trim()).filter(Boolean)
    : [];

  const token = localStorage.getItem("token");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          sharedWith: sharedWithArray,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        fetchData && fetchData();
        setCreateTodo(false);
      } else {
        alert(responseData.message || "Failed to create");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="popup">
      <div className="popup-main">
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="popup-form-heading">Add New To-Do</div>

          <label>Title :</label>
          <input
            required
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
          />

          <label>Description :</label>
          <textarea
            required
            rows={4}
            name="description"
            value={data.description}
            onChange={handleChange}
          />

          <label>Share to :</label>
          <input
            type="text"
            name="sharedWith"
            value={data.sharedWith}
            onChange={handleChange}
          />

          <div className="popup-form-buttons">
            <div onClick={() => setCreateTodo(false)} style={{ cursor: "pointer" }}>
              Cancel
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTodoPopup;
