import React from 'react'
import { Routes, Route, NavLink } from "react-router-dom";
import Home from './Home'
import Form from './Form'


function App() {
  return (
    <div id="app">
      <nav>
        {/* NavLinks here */}
        <NavLink to="/">
            Home 
        </NavLink> 
        <NavLink to="/order">
            Order 
        </NavLink>
      </nav>
      {/* Route and Routes here */}
      
      <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/order" element={<Form />}></Route>
      </Routes>
    </div>
  )
}

export default App
