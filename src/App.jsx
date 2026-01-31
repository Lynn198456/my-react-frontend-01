// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Items } from './components/Items';
// import { ItemDetail } from './components/ItemDetail';

// function App() {
//   return (
//     <Router>
//       <div style={{ padding: '20px' }}>
//         <Routes>
//           <Route path="/" element={<Items />} />
//           <Route path="/items/:id" element={<ItemDetail />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Items from "./components/Items.jsx";
import ItemDetail from "./components/ItemDetail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/items" />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/new" element={<ItemDetail />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
