import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimalForm from '../components/AnimalForm';
import { toast } from 'react-toastify';

function CadastroPage() {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try {
      await axios.post('http://localhost:8080/api/animals', formData);
      toast.success('Animal cadastrado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao cadastrar animal. Verifique os dados e tente novamente.');
      console.error('Erro ao cadastrar animal', error);
    }
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  return (
    <div className="cadastro-container container mt-5">
      <h2 className="page-title">Cadastro de Animais</h2>
      <AnimalForm onSubmit={handleFormSubmit} />
    </div>
  );
}

export default CadastroPage;
