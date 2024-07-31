import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CadastroPage from './pages/CadastroPage';
import ConsultaPage from './pages/ConsultaPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/consulta" element={<ConsultaPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Bem-vindo ao Sistema de Adoção de Animais</h1>
        <p className="lead">Escolha uma opção no menu abaixo para começar.</p>
        <hr className="my-4" />
        <div className="d-flex justify-content-center">
          <Link to="/cadastro" className="btn btn-primary mx-2">Cadastro de Animais</Link>
          <Link to="/consulta" className="btn btn-primary mx-2">Consulta de Animais</Link>
        </div>
      </div>
    </div>
  );
}

export default App;
