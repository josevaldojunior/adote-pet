import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimalList from "../components/AnimalList";
import { toast } from "react-toastify";
import { Row, Col, Button, Form, Pagination } from "react-bootstrap";

function ConsultaPage() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [animals, setAnimals] = useState([]);
  const [lastSearch, setLastSearch] = useState({ type: "", value: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchAllAnimals();
  }, []);

  const fetchAllAnimals = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/animals");
      setAnimals(response.data);
      setLastSearch({ type: "all", value: "" });
    } catch (error) {
      toast.error("Erro ao listar todos os animais. Tente novamente.");
      console.error("Erro ao listar todos os animais", error);
    }
  };

  const handleSearch = async () => {
    try {
      let response;
      if (searchType === "id" && searchId) {
        response = await axios.get('http://localhost:8080/api/animals/${searchId}');
        setAnimals([response.data]);
        setLastSearch({ type: "id", value: searchId });
      } else if (searchType === "name" && searchName) {
        response = await axios.get('http://localhost:8080/api/animals/name?name=${searchName}');
        setAnimals(response.data);
        setLastSearch({ type: "name", value: searchName });
      } else {
        toast.error("Por favor, insira um ID ou Nome para pesquisar.");
        setAnimals([]);
      }
    } catch (error) {
      toast.error("Erro ao buscar animais. Tente novamente.");
      console.error("Erro ao buscar animais", error);
    }
  };

  const handleUpdateStatus = async (animalId) => {
    try {
      await axios.patch('http://localhost:8080/api/animals/status/${animalId}');
      toast.success("Status do animal alterado com sucesso!");

      if (lastSearch.type === "id") {
        const response = await axios.get('http://localhost:8080/api/animals/${lastSearch.value}');
        setAnimals([response.data]);
      } else if (lastSearch.type === "name") {
        const response = await axios.get('http://localhost:8080/api/animals/name?name=${lastSearch.value}');
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
  const currentAnimals = animals.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(animals.length / itemsPerPage)) {
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
            className="mx-1">
            Pesquisar por ID
          </Button>
          <Button
            onClick={() => handleSearchTypeChange("name")}
            variant="outline-primary"
            className="mx-1">
            Pesquisar por Nome
          </Button>
          {searchType && (
            <>
              <Form.Control
                type="text"
                placeholder={'Digite o ${searchType === "id" ? "ID" : "Nome"}'}
                value={searchType === "id" ? searchId : searchName}
                onChange={(e) =>
                  searchType === "id"
                    ? setSearchId(e.target.value)
                    : setSearchName(e.target.value)
                }
                className="d-inline-block w-auto mx-1"/>
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
      {currentAnimals.length > 0 && (
        <>
          <AnimalList
            animals={currentAnimals}
            onUpdateStatus={handleUpdateStatus}
          />
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="flex-grow-1 d-flex justify-content-center">
              <Pagination className="m-0">
                <Pagination.Prev
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                />
                {Array.from(
                  { length: Math.ceil(animals.length / itemsPerPage) },
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
                    currentPage === Math.ceil(animals.length / itemsPerPage)
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
      )}
    </div>
  );
}

export default ConsultaPage;