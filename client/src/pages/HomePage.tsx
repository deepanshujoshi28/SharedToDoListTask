import React, { useEffect, useState } from "react";
import SideNav from "../components/Home/SideNav";
import ToDoData from "../components/Home/ToDoData";

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  sharedWith?: string[];
  completed?: boolean;
  created_at?: string;
  [key: string]: any;
}

interface TodoDataResponse {
  sharedToMe: TodoItem[];
  sharedByMe: TodoItem[];
  createdByMe: TodoItem[];
  createdByMeOrSharedToMe: TodoItem[];
}

const HomePage: React.FC = () => {
  const [todoType, setTodoType] = useState<string>("Sticky Wall");
  const [loading, setLoading] = useState<boolean>(true);

  const [data, setData] = useState<TodoDataResponse>({
    sharedToMe: [],
    sharedByMe: [],
    createdByMe: [],
    createdByMeOrSharedToMe: [],
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/todos/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setData(responseData);
      } else {
        alert(responseData.message || "Failed to get data");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="home">
      <div className="home-main">
        <div className="home-menu">
          <SideNav fetchData={fetchData} setTodoType={setTodoType} todoType={todoType} />
        </div>
        <div className="home-content">
          <ToDoData fetchData={fetchData} allData={data} todoType={todoType} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
