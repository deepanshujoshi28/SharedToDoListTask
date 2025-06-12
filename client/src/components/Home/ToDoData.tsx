import UpdateTodoPopup from "./UpdateTodoPopup";
import { useState } from "react";

interface Todo {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  shared_with?: string[];
}

interface EditForm {
  title: string;
  description: string;
  sharedWith: string;
}

interface ToDoDataProps {
  fetchData?: () => void;
  allData: {
    sharedToMe: Todo[];
    sharedByMe: Todo[];
    createdByMe: Todo[];
    createdByMeOrSharedToMe: Todo[];
  };
  todoType: string;
  loading: boolean;
}

const ToDoData: React.FC<ToDoDataProps> = ({ fetchData, allData, todoType, loading }) => {

  const stickyWallData = allData.createdByMeOrSharedToMe;
  const myWallData = allData.createdByMe;
  const inboxData = allData.sharedToMe;
  const sentData = allData.sharedByMe;

  const [editTodo, setEditTodo] = useState(false);
  const [editType, setEditType] = useState<"edit" | "share" | null>(null);

  const token = localStorage.getItem("token");

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this todo?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData?.();
    } catch {
      alert("Server Error");
    }
  };

  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "",
    description: "",
    sharedWith: "",
  });

  const handleEditClick = (e: Todo) => {
    setEditingTodoId(e.id);
    setEditType("edit");
    setEditForm({
      title: e.title,
      description: e.description || "",
      sharedWith: (e.shared_with || []).join(", "),
    });
    setEditTodo(true);
  };

  const handleShareClick = (e: Todo) => {
    setEditingTodoId(e.id);
    setEditType("share");
    setEditForm({
      title: e.title,
      description: e.description || "",
      sharedWith: (e.shared_with || []).join(", "),
    });
    setEditTodo(true);
  };

  const renderTodos = (todos: Todo[]) =>
    todos.map((e) => (
      <div className="home-content-data-col" key={e.id}>
        <div className="home-content-data-col-data">
          <div>
            <div className="home-content-data-title">
              {e.title}
              {(todoType === "My Wall" || todoType === "Sent") && (
                <div className="home-content-data-edit">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                  <div className="home-content-data-edit-option">
                    <div onClick={() => handleEditClick(e)}>
                      <i className="fa-solid fa-pen-to-square"></i> edit
                    </div>
                    <div onClick={() => handleDelete(e.id)}>
                      <i className="fa-solid fa-trash-can"></i> delete
                    </div>
                    <div onClick={() => handleShareClick(e)}>
                      <i className="fa-solid fa-share-from-square"></i> share
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="home-content-data-text">{e.description || ""}</div>
          </div>
          <div>
            <div className="home-content-data-date">
              {e.created_at ? new Date(e.created_at).toDateString() : ""}
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="home-content-data">
      {editTodo && editingTodoId && (
        <UpdateTodoPopup
          setEditTodo={setEditTodo}
          fetchData={fetchData}
          editingTodoId={editingTodoId}
          editForm={editForm}
          setEditForm={setEditForm}
          editType={editType || ""}
        />
      )}

      <div className="home-content-heading">
        {todoType}{" "}
        <i onClick={() => fetchData?.()} className="fa-solid fa-rotate"></i>
      </div>

      {loading && <div className="home-content-data-loading">Loading.....</div>}

      {todoType === "Sticky Wall" && (
        stickyWallData.length > 0 ? (
          <div className="home-content-data-list">{renderTodos(stickyWallData)}</div>
        ) : (
          <div className="home-content-data-empty">
            <i className="fa-solid fa-database"></i>
            <br />
            No Such Data
          </div>
        )
      )}

      {todoType === "My Wall" && (
        myWallData.length > 0 ? (
          <div className="home-content-data-list">{renderTodos(myWallData)}</div>
        ) : (
          <div className="home-content-data-empty">
            <i className="fa-solid fa-database"></i>
            <br />
            No Such Data
          </div>
        )
      )}

      {todoType === "Inbox" && (
        inboxData.length > 0 ? (
          <div className="home-content-data-list">{renderTodos(inboxData)}</div>
        ) : (
          <div className="home-content-data-empty">
            <i className="fa-solid fa-database"></i>
            <br />
            No Such Data
          </div>
        )
      )}

      {todoType === "Sent" && (
        sentData.length > 0 ? (
          <div className="home-content-data-list">{renderTodos(sentData)}</div>
        ) : (
          <div className="home-content-data-empty">
            <i className="fa-solid fa-database"></i>
            <br />
            No Such Data
          </div>
        )
      )}
    </div>
  );
};

export default ToDoData;
