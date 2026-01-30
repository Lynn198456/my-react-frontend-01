import { useEffect, useState } from 'react';

import './App.css'
import {Route, Routes} from "react-router-dom";
import TestAPI from "./components/TextAPI";
import Items from './components/Items';


function App() {
  return (
  
      <Routes>
        <Route path="/test_api" element={<TestAPI />} />
        <Route path='/src/components/Items.jsx' element={<Items></Items>}></Route>
      </Routes>
  )
}

export default App
