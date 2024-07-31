import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimalList from "../components/AnimalList";
import { toast } from "react-toastify";
import { Row, Col, Button, Form, Pagination, Modal } from "react-bootstrap";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function ConsultaPage() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [animals, setAnimals] = useState([]);
  const [lastSearch, setLastSearch] = useState({ type: "", value: "" });
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchAllAnimals();
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const fetchAllAnimals = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/animals");
      setAnimals(response.data);
      setLastSearch({ type: "all", value: "" });
    } catch (error) {
      toast.error("Erro ao listar todos os animais. Tente novamente.");
      console.error("Erro ao listar todos os animais", error);
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSearch = async () => {
    try {
      let response;
      if (searchType === "id" && searchId) {
        response = await axios.get(`http://localhost:8080/api/animals/${searchId}`);
        if (response.data) {
          setAnimals([response.data]);
          setLastSearch({ type: "id", value: searchId });
        }
      } else if (searchType === "name" && searchName) {
        response = await axios.get(
          `http://localhost:8080/api/animals/name?name=${searchName}`
        );
        if (response.data && response.data.length > 0) {
          setAnimals(response.data);
          setLastSearch({ type: "name", value: searchName });
        } else {
          toast.info("Nenhum animal encontrado para o nome fornecido.");
          fetchAllAnimals();
        }
      } else {
        toast.error("Por favor, insira um ID ou Nome para pesquisar.");
      }
      setSearchType("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.info("Nenhum animal encontrado para o ID fornecido.");
      } else {
        toast.error("Erro ao buscar animais. Tente novamente.");
        console.error("Erro ao buscar animais", error);
      }
      fetchAllAnimals();
    }
  };

  const handleUpdateStatus = async (animalId) => {
    try {
      await axios.patch(`http://localhost:8080/api/animals/status/${animalId}`);
      toast.success("Status do animal alterado com sucesso!");

      if (lastSearch.type === "id") {
        const response = await axios.get(
          `http://localhost:8080/api/animals/${lastSearch.value}`
        );
        setAnimals([response.data]);
      } else if (lastSearch.type === "name") {
        const response = await axios.get(
          `http://localhost:8080/api/animals/name?name=${lastSearch.value}`
        );
        setAnimals(response.data);
      } else if (lastSearch.type === "all") {
        fetchAllAnimals();
      }
    } catch (error) {
      toast.error("Erro ao alterar status do animal. Tente novamente.");
      console.error("Erro ao alterar status do animal", error);
    }
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchId("");
    setSearchName("");
  };

  const handleBackToMenu = () => {
    navigate("/");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredAnimals = animals.filter((animal) => {
    return (filterStatus ? animal.status === filterStatus : true) &&
           (filterCategory ? animal.categoria === filterCategory : true);
  });

  const sortedAnimals = [...filteredAnimals].sort((a, b) => {
    if (!sortField) return 0;
    const aField = a[sortField];
    const bField = b[sortField];
    if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
    if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const currentAnimals = sortedAnimals.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredAnimals.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleViewDetails = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleCloseDetails = () => {
    setSelectedAnimal(null);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "status") {
      setFilterStatus(value);
    } else if (filterType === "category") {
      setFilterCategory(value);
    }
    setCurrentPage(1);
  };

  const applyFilters = () => {
    if (!initialLoad) {
      const results = animals.filter((animal) => {
        return (filterStatus ? animal.status === filterStatus : true) &&
               (filterCategory ? animal.categoria === filterCategory : true);
      });

      if (results.length === 0) {
        toast.info("Nenhum animal encontrado para os filtros selecionados.");
        setFilterStatus("");
        setFilterCategory("");
        fetchAllAnimals();
      }
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filterStatus, filterCategory]);

  return (
    <div className="consulta-container container mt-5">
      <h2 className="page-title text-center">Consulta de Animais</h2>
      <Row className="align-items-center justify-content-between mb-4">
        <Col sm="auto" className="d-flex align-items-center">
          <Button onClick={fetchAllAnimals} variant="outline-primary" className="mx-1">
            Buscar Todos
          </Button>
          <Button
            onClick={() => handleSearchTypeChange("id")}
            variant="outline-primary"
            className="mx-1"
          >
            Pesquisar por ID
          </Button>
          <Button
            onClick={() => handleSearchTypeChange("name")}
            variant="outline-primary"
            className="mx-1"
          >
            Pesquisar por Nome
          </Button>
          {searchType && (
            <>
              <Form.Control
                type="text"
                placeholder={`Digite o ${searchType === "id" ? "ID" : "Nome"}`}
                value={searchType === "id" ? searchId : searchName}
                onChange={(e) =>
                  searchType === "id"
                    ? setSearchId(e.target.value)
                    : setSearchName(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="d-inline-block w-auto mx-1"
              />
              <Button onClick={handleSearch} variant="primary" className="mx-1">
                Pesquisar
              </Button>
            </>
          )}
        </Col>
        <Col
          sm="auto"
          className="d-flex align-items-center justify-content-end"
        >
          <span className="mr-2">Mostrar</span>
          <Form.Control
            as="select"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="d-inline-block w-auto mx-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={animals.length}>Todos</option>
          </Form.Control>
          <span>itens por página</span>
        </Col>
      </Row>
      {animals.length > 0 ? (
        <>
          <AnimalList
            animals={currentAnimals}
            onUpdateStatus={handleUpdateStatus}
            onViewDetails={handleViewDetails}
            onSort={handleSort}
          />
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              <Form.Control
                as="select"
                value={filterStatus}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="d-inline-block w-auto mx-1"
              >
                <option value="">Todos os Status</option>
                <option value="ADOTADO">Adotado</option>
                <option value="DISPONIVEL">Disponível</option>
              </Form.Control>
              <Form.Control
                as="select"
                value={filterCategory}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="d-inline-block w-auto mx-1"
              >
                <option value="">Todas as Categorias</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
              </Form.Control>
            </div>
            <div className="flex-grow-1 d-flex justify-content-center">
              <Pagination className="m-0">
                <Pagination.Prev
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                />
                {Array.from(
                  { length: Math.ceil(filteredAnimals.length / itemsPerPage) },
                  (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => handleGoToPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  )
                )}
                <Pagination.Next
                  onClick={handleNextPage}
                  disabled={
                    currentPage === Math.ceil(filteredAnimals.length / itemsPerPage)
                  }
                />
              </Pagination>
            </div>
            <Button
              onClick={handleBackToMenu}
              variant="primary"
              className="ml-3"
            >
              Voltar
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center mt-4">
          <p>Nenhum animal encontrado para os filtros selecionados.</p>
        </div>
      )}
      {selectedAnimal && (
        <Modal show={true} onHide={handleCloseDetails} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">Detalhes do Animal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <table>
            <tbody>
              <tr>
                <td>ID:</td>
                <td>{selectedAnimal.id}</td>
              </tr>
              <tr>
                <td>Nome:</td>
                <td>{selectedAnimal.nome}</td>
              </tr>
              <tr>
                <td>Descrição:</td>
                <td>{selectedAnimal.descricao}</td>
              </tr>
              <tr>
                <td>URL da Imagem:</td>
                <td><a href={selectedAnimal.urlImagem} target="_blank" rel="noopener noreferrer">{selectedAnimal.urlImagem}</a></td>
              </tr>
              <tr>
                <td>Categoria:</td>
                <td>{selectedAnimal.categoria}</td>
              </tr>
              <tr>
                <td>Data de Nascimento:</td>
                <td>{formatDate(selectedAnimal.dataNascimento)}</td>
              </tr>
              <tr>
                <td>Idade:</td>
                <td>{selectedAnimal.idade}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>{selectedAnimal.status}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={handleCloseDetails}>Fechar</Button>
        </Modal.Footer>
      </Modal>
      )}
    </div>
  );
}

export default ConsultaPage;
