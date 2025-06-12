import type { ReactElement } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/Home/PrivateRoute";

import "./App.css";
import "./css/Auth.css";
import "./css/Home/SideNav.css";
import "./css/Home/HomePage.css";
import "./css/Home/HomeContent.css";
import "./css/Home/Popup.css";

const App = (): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;
