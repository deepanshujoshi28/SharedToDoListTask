import CreateTodoPopup from "./CreateTodoPopup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SideNavProps {
  fetchData?: () => void;
  setTodoType: (type: string) => void;
  todoType: string;
}

const SideNav: React.FC<SideNavProps> = ({ fetchData, setTodoType, todoType }) => {
  const userName = localStorage.getItem("userName");

  const [createTodo, setCreateTodo] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    if (!window.confirm("You want to logout?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div>
      {createTodo && (
        <CreateTodoPopup setCreateTodo={setCreateTodo} fetchData={fetchData} />
      )}

      <div className="side-nav">
        <div className="side-nav-main">
          <div className="side-nav-top">
            <div className="side-nav-heading">
              Hi, {userName ? userName : "Namestay 🙏"}
            </div>
            <div onClick={() => setCreateTodo(true)} className="side-nav-button">
              <i className="fa-solid fa-plus"></i> Add New To-Do
            </div>
            <div className="side-nav-menu">
              <div className="side-nav-menu-heading">TASKS</div>
              <div
                onClick={() => setTodoType("Sticky Wall")}
                className={`side-nav-menu-option ${
                  todoType === "Sticky Wall" ? "side-nav-menu-option-selected" : ""
                }`}
              >
                <i className="fa-solid fa-list-check"></i> Sticky Wall
              </div>
              <div
                onClick={() => setTodoType("My Wall")}
                className={`side-nav-menu-option ${
                  todoType === "My Wall" ? "side-nav-menu-option-selected" : ""
                }`}
              >
                <i className="fa-solid fa-note-sticky"></i> My Wall
              </div>
              <div
                onClick={() => setTodoType("Inbox")}
                className={`side-nav-menu-option ${
                  todoType === "Inbox" ? "side-nav-menu-option-selected" : ""
                }`}
              >
                <i className="fa-solid fa-inbox"></i> Inbox
              </div>
              <div
                onClick={() => setTodoType("Sent")}
                className={`side-nav-menu-option ${
                  todoType === "Sent" ? "side-nav-menu-option-selected" : ""
                }`}
              >
                <i className="fa-solid fa-paper-plane"></i> Sent
              </div>
            </div>
          </div>

          <div onClick={logout} className="side-nav-bottom">
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
