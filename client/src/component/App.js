import React from 'react';
import Body from './Body';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Wordlist from './Wordlist';
import Insert from './Insert';
import Update from './Update';
import "./App.css"
// View 영역에서 Router 역할
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
       <Route path='/' element={<Body />}></Route>
       <Route path='/list' element={<Wordlist />}></Route>
       <Route path='/insert' element={<Insert />}></Route>
       <Route path='/update' element={<Update />}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
