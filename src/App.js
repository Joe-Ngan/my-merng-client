import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import 'semantic-ui-css/semantic.css';

import Menubar from "./components/Menubar";
import Container from '@mui/material/Container';

import { AuthProvider } from "./context/auth";
import AuthRoute from './util/AuthRoute';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from './pages/SinglePost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Menubar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route exact path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route exact path="/posts/:postId" element={<SinglePost/>}/>
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
