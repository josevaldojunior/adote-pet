import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Modal, Button } from 'react-bootstrap';

function AnimalList({ animals, onUpdateStatus, onViewDetails, onSort }) {
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
            <th onClick={() => onSort('id')}>ID</th>
            <th onClick={() => onSort('nome')}>Nome</th>
            <th onClick={() => onSort('descricao')}>Descrição</th>
            <th>URL da Imagem</th>
            <th onClick={() => onSort('categoria')}>Categoria</th>
            <th onClick={() => onSort('dataNascimento')}>Data de Nascimento</th>
            <th onClick={() => onSort('idade')}>Idade</th>
            <th onClick={() => onSort('status')}>Status</th>
            <th>Alterar</th>
            <th>Detalhes</th>
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
                <button className="btn btn-secondary btn-size" onClick={() => handleStatusChange(animal)}>
                  Alterar Status
                </button>
              </td>
              <td className="text-center">
                <button className="btn btn-info" onClick={() => onViewDetails(animal)}>
                  Ver
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
