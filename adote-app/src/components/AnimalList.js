import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Modal, Button } from 'react-bootstrap';

function AnimalList({ animals, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const handleStatusChange = (animal) => {
    setSelectedAnimal(animal);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedAnimal) {
      onUpdateStatus(selectedAnimal.id);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (animals.length === 0) return null;

  return (
    <>
      <table className="animal-table table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>URL da Imagem</th>
            <th>Categoria</th>
            <th>Data de Nascimento</th>
            <th>Idade</th>
            <th>Status</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((animal) => (
            <tr key={animal.id}>
              <td>{animal.id}</td>
              <td>{animal.nome}</td>
              <td>{animal.descricao}</td>
              <td>
                <a href={animal.urlImagem} target="_blank" rel="noopener noreferrer">
                  {animal.urlImagem}
                </a>
              </td>
              <td>{animal.categoria}</td>
              <td>{formatDate(animal.dataNascimento)}</td>
              <td>{animal.idade}</td>
              <td>{animal.status}</td>
              <td className="text-center">
                <button className="btn btn-secondary" onClick={() => handleStatusChange(animal)}>
                  Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza de que deseja alterar o status desse animal?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirm}>Sim</Button>
          <Button variant="secondary" onClick={handleClose}>Não</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AnimalList;