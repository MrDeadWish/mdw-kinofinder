import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import NotFound from './screens/NotFound';
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import FilmDetails from "./screens/FilmDetails";

function App() {
    return (

        <Router>
            <div className="flex flex-col h-screen">
                <HeaderComponent></HeaderComponent>
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomeScreen/>}/>
                        <Route path="/film/:id" element={<FilmDetails/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
                <FooterComponent></FooterComponent>
            </div>
        </Router>
    );
}

export default App;
