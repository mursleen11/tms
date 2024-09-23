import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './component/Dashboard';
import SignUp from './component/SignUp';
import Login from './component/Login';
import Admin from './component/Admin';
import AdminPanel from './component/AdminPanel';
import KeywordResult from './component/KeywordResult';
import UserUpdate from './component/UserUpdate';
import UserProfile from './component/UserProfile';
import ProfileUpdate from './component/ProfileUpdate';
import ReadMore from './component/ReadMore';
import Dash from './component/Dash';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/SignUp' element= {<SignUp/>}/>
          <Route path='/Login' element= {<Login/>}/>
          <Route path='/Admin' element= {<Admin/>}/>
          <Route path='/AdminPanel' element={<AdminPanel/>}/>
          <Route path="/search/:word" element={<KeywordResult />} />
          <Route path='/UserUpdate/:id' element={<UserUpdate/>}/>
          <Route path='/UserProfile' element={<UserProfile/>}/>
          <Route path='ProfileUpdate/:id' element={<ProfileUpdate/>}/>
          <Route path="/article/:id" element={<ReadMore />} />
          <Route path='Dash' element={<Dash/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
