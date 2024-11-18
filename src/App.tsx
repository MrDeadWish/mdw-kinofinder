import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import NotFound from './screens/NotFound';
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import FilmDetails from "./screens/FilmDetails";

function App() {
  return (

      <Router>
          <HeaderComponent></HeaderComponent>
        <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/film/:id" element={<FilmDetails/>} />
            <Route path="*" element={<NotFound/>}/>

        </Routes>
          <FooterComponent></FooterComponent>
      </Router>
  );
}

export default App;
