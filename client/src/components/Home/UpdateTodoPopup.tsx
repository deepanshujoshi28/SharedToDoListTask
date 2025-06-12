
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface EditForm {
  title: string;
  description: string;
  sharedWith: string; 
}

interface UpdateTodoPopupProps {
  fetchData?: () => void;
  setEditTodo: React.Dispatch<React.SetStateAction<boolean>>;
  editingTodoId: string;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  editType: "edit" | "share" | string;
}

const UpdateTodoPopup: React.FC<UpdateTodoPopupProps> = ({
  fetchData,
  setEditTodo,
  editingTodoId,
  editForm,
  setEditForm,
  editType,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sharedWithArray = editForm.sharedWith
    ? editForm.sharedWith.split(",").map((email) => email.trim()).filter(Boolean)
    : [];

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/todos/${editingTodoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          sharedWith: sharedWithArray,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        fetchData && fetchData();
        setEditTodo(false);
      } else {
        alert(responseData.message || "Failed to update");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="popup">
        <div className="popup-main">
          <form onSubmit={handleSubmit} className="popup-form">
            <div className="popup-form-heading">
              {editType === "share"
                ? "Share To-Do With"
                : editType === "edit"
                ? "Edit To-Do"
                : "Edit To-Do"}
            </div>

            {editType === "edit" ? (
              <>
                <label>Title :</label>
                <input
                  required
                  type="text"
                  value={editForm.title}
                  onChange={handleChange}
                  name="title"
                />

                <label>Description :</label>
                <textarea
                  required
                  value={editForm.description}
                  rows={4}
                  onChange={handleChange}
                  name="description"
                />
              </>
            ) : editType === "share" ? (
              <>
                <label>Share to :</label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={editForm.sharedWith}
                  name="sharedWith"
                />
              </>
            ) : (
              ""
            )}

            <div className="popup-form-buttons">
              <div onClick={() => setEditTodo(false)} style={{ cursor: "pointer" }}>
                Cancel
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateTodoPopup;
