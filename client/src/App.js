import React, { useEffect, createContext, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/Navbar";
import Home from "./components/Home";
import Signin from "./components/Signin";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import CreatePost from "./components/CreatePost";
import UserProfile from "./components/UserProfile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { reducer, initialState } from "./reducers/UserReducer";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);
    if (user) {
      dispatch({ type: "USER", payload: user });
      // navigate("/");
    } else {
      navigate("/Signin");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/CreatePost" element={<CreatePost />} />
      <Route path="/Profile/:userId" element={<UserProfile />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
