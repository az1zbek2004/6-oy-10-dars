import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Registr from "./components/Registr";
import Login from "./components/Login";
import Home from "./components/Home";
import { useEffect, useState } from "react";

function ProtectedRoute({children, redirectTo = '/login', Authenticated}) {
  const navigate = useNavigate()

  if (!Authenticated) {
    navigate(redirectTo)
  }

  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  }, [])
  return (
    <>
      <Routes>
        {/* public route */}
        <Route path="/registr" element={<Registr></Registr>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>

        {/* protected route */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated = {token ? true : false}>
            <Home></Home>
          </ProtectedRoute>
        }></Route>

      </Routes>
    </>
  );
}

export default App;
