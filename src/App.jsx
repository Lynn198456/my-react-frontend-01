import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import TestApi from './components/TestApi';
import TestMongo from './components/TestMongo';
import RequireAuth from './middleware/RequireAuth';
import Profile from './components/Profile';
import Login from './components/Login';
import Logout from './components/Logout';
function App() {
 return(
 <Routes>
 <Route path='/' element={<Navigate to="/login" replace />}/>
 <Route path='/test_api' element={<TestApi/>}/>
 <Route path='/test_mongo' element={<TestMongo/>}/>
 <Route path='/login' element={<Login/>}/>
 <Route path='/profile' element={ <RequireAuth>
 <Profile/>
 </RequireAuth>
 }/>
 <Route path='/logout' element={
 <RequireAuth>
 <Logout/>
 </RequireAuth>
 }/>
 <Route path='*' element={<Navigate to="/login" replace />}/>
 </Routes>
 );
}
export default App
