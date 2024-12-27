import './App.css'
import { Route, Routes } from 'react-router-dom'
import Aos from 'aos'
import "aos/dist/aos.css"
import React, { lazy, Suspense } from 'react';
import { Loader } from './utils/Loader'


const Signup = lazy(() => import('./pages/Signup'));
const Createpost = lazy(() => import('./pages/Createpost'));
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Footer = lazy(() => import('./components/Footer'));
const Navbar = lazy(() => import('./components/Navbar'));

// Initialize Animation on Scroll library with default options
Aos.init({
  once: true,
})


function App() {


  return (

    <div className="App">
      <Suspense fallback={<Loader />}>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/createpost" element={<Createpost />} />
        </Routes>
        <Footer />
      </Suspense>
    </div>

  );
}

export default App
