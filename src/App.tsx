import React from 'react';
import logo from './logo.svg';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Register from './pages/register';
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Home from './pages/home';


function App() {
  const [user] = useAuthState(auth);
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
      </Routes>

    </>
  );
}

export default App;
