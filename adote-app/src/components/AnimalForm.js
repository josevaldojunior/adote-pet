import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Container, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEdit, FaSave } from 'react-icons/fa';

function AnimalForm({ onSubmit }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [urlImagem, setUrlImagem] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [status, setStatus] = useState('DISPONIVEL');
  const [categorias, setCategorias] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCategoria, setNewCategoria] = useState('');
  const [editCategoria, setEditCategoria] = useState({ id: '', nome: '' });
  const [editingCategoriaId, setEditingCategoriaId] = useState(null);

  // Estado para armazenar os erros de validação dos campos
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias', error);
      }
    };
    fetchCategorias();
  }, []);

  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {};
    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!urlImagem.trim()) {
      newErrors.urlImagem = 'URL da Imagem é obrigatória';
    } else if (!/^https?:\/\/.+\..+$/.test(urlImagem)) {
      newErrors.urlImagem = 'URL da Imagem deve ser uma URL válida';
    }
    if (!categoriaId) newErrors.categoriaId = 'Categoria é obrigatória';
    if (!dataNascimento) {
      newErrors.dataNascimento = 'Data de Nascimento é obrigatória';
    } else if (isNaN(Date.parse(dataNascimento))) {
      newErrors.dataNascimento = 'Data de Nascimento deve ser uma data válida';
    }
    if (!status) newErrors.status = 'Status é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Passar os dados do formulário para a função onSubmit
    onSubmit({
      nome,
      descricao,
      urlImagem,
      categoria: {
        id: categoriaId
      },
      dataNascimento,
      status
    });
  };

  // Função para validar um campo individualmente
  const handleBlur = (field) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'nome':
        if (!nome.trim()) {
          newErrors.nome = 'Nome é obrigatório';
        } else {
          delete newErrors.nome;
        }
        break;
      case 'descricao':
        if (!descricao.trim()) {
          newErrors.descricao = 'Descrição é obrigatória';
        } else {
          delete newErrors.descricao;
        }
        break;
      case 'urlImagem':
        if (!urlImagem.trim()) {
          newErrors.urlImagem = 'URL da Imagem é obrigatória';
        } else if (!/^https?:\/\/.+\..+$/.test(urlImagem)) {
          newErrors.urlImagem = 'URL da Imagem deve ser uma URL válida';
        } else {
          delete newErrors.urlImagem;
        }
        break;
      case 'categoriaId':
        if (!categoriaId) {
          newErrors.categoriaId = 'Categoria é obrigatória';
        } else {
          delete newErrors.categoriaId;
        }
        break;
      case 'dataNascimento':
        if (!dataNascimento) {
          newErrors.dataNascimento = 'Data de Nascimento é obrigatória';
        } else if (isNaN(Date.parse(dataNascimento))) {
          newErrors.dataNascimento = 'Data de Nascimento deve ser uma data válida';
        } else {
          delete newErrors.dataNascimento;
        }
        break;
      case 'status':
        if (!status) {
          newErrors.status = 'Status é obrigatório';
        } else {
          delete newErrors.status;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Função para adicionar uma nova categoria
  const handleAddCategoria = async () => {
    if (!newCategoria.trim()) {
      toast.error('O nome da categoria não pode estar em branco.');
      return;
    }
    if (categorias.some((categoria) => categoria.nome.toLowerCase() === newCategoria.toLowerCase())) {
      toast.error('Essa categoria já está cadastrada.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/categorias', { nome: newCategoria });
      setCategorias([...categorias, response.data]);
      toast.success('Categoria cadastrada com sucesso!');
      setShowAddModal(false);
      setNewCategoria('');
    } catch (error) {
      toast.error('Erro ao cadastrar categoria. Tente novamente.');
      console.error('Erro ao cadastrar categoria', error);
    }
  };

  // Função para editar uma categoria
  const handleEditCategoria = async (id, nome) => {
    if (!nome.trim()) {
      toast.error('O nome da categoria não pode estar em branco.');
      return;
    }
    if (categorias.some((categoria) => categoria.nome.toLowerCase() === nome.toLowerCase() && categoria.id !== id)) {
      toast.error('Essa categoria já está cadastrada.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/api/categorias/alterar/${id}/${nome}`);
      const updatedCategorias = categorias.map((categoria) =>
        categoria.id === id ? { ...categoria, nome: response.data.nome } : categoria
      );
      setCategorias(updatedCategorias);
      toast.success('Categoria alterada com sucesso!');
      setEditingCategoriaId(null);
      setEditCategoria({ id: '', nome: '' });
    } catch (error) {
      toast.error('Erro ao alterar categoria. Tente novamente.');
      console.error('Erro ao alterar categoria', error);
    }
  };

  // Função para fechar o modal de adicionar categoria
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewCategoria('');
  };

  // Função para fechar o modal de editar categoria
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditCategoria({ id: '', nome: '' });
    setEditingCategoriaId(null);
  };

  // Função para iniciar a edição de uma categoria
  const handleEditClick = (categoria) => {
    setEditingCategoriaId(categoria.id);
    setEditCategoria(categoria);
  };

  // Função para salvar a categoria editada
  const handleSaveClick = (categoria) => {
    handleEditCategoria(categoria.id, editCategoria.nome);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="nome">
              <Form.Label column sm="2">Nome:</Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={() => handleBlur('nome')}
                  isInvalid={!!errors.nome}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="descricao" className="mt-3">
              <Form.Label column sm="2">Descrição:</Form.Label>
              <Col sm="10">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  onBlur={() => handleBlur('descricao')}
                  isInvalid={!!errors.descricao}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.descricao}</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="urlImagem" className="mt-3">
              <Form.Label column sm="2">URL da Imagem:</Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={urlImagem}
                  onChange={(e) => setUrlImagem(e.target.value)}
                  onBlur={() => handleBlur('urlImagem')}
                  isInvalid={!!errors.urlImagem}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.urlImagem}</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="categoriaId" className="mt-3">
              <Form.Label column sm="2">Categoria:</Form.Label>
              <Col sm="4">
                <Form.Control
                  as="select"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  onBlur={() => handleBlur('categoriaId')}
                  isInvalid={!!errors.categoriaId}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.categoriaId}</Form.Control.Feedback>
              </Col>
              <Col sm="3">
                <Button variant="primary" className="no-wrap btn-block" onClick={() => setShowAddModal(true)}>Cadastrar Categoria</Button>
              </Col>
              <Col sm="3">
                <Button variant="primary" className="no-wrap btn-block" onClick={() => setShowEditModal(true)}>Alterar Categoria</Button>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="dataNascimento" className="mt-3">
              <Form.Label column sm="2">Data de Nascimento:</Form.Label>
              <Col sm="4">
                <Form.Control
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  onBlur={() => handleBlur('dataNascimento')}
                  isInvalid={!!errors.dataNascimento}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.dataNascimento}</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="status" className="mt-3">
              <Form.Label column sm="2">Status:</Form.Label>
              <Col sm="4">
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onBlur={() => handleBlur('status')}
                  isInvalid={!!errors.status}
                  required>
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="ADOTADO">Adotado</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Col sm={{ span: 10, offset: 2 }} className="d-flex justify-content-end">
                <Button variant="primary" type="submit" className="me-2">Cadastrar</Button>
                <Button variant="primary" type="button" onClick={() => window.history.back()}>Voltar</Button>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="newCategoria">
            <Form.Label>Nome da Categoria</Form.Label>
            <Form.Control
              type="text"
              value={newCategoria}
              onChange={(e) => setNewCategoria(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddCategoria}>Cadastrar</Button>
          <Button variant="primary" onClick={handleCloseAddModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categorias.map((categoria) => (
            <Form.Group key={categoria.id} className="mb-3" controlId={`editCategoria-${categoria.id}`}>
              <Row className="align-items-center">
                <Col sm="8">
                  <Form.Control
                    type="text"
                    readOnly={editingCategoriaId !== categoria.id}
                    value={editingCategoriaId === categoria.id ? editCategoria.nome : categoria.nome}
                    onChange={(e) => setEditCategoria({ id: categoria.id, nome: e.target.value })}
                    onBlur={() => handleBlur(`categoria-${categoria.id}`)}
                    isInvalid={!!errors[`categoria-${categoria.id}`]}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors[`categoria-${categoria.id}`]}</Form.Control.Feedback>
                </Col>
                <Col sm="4">
                  {editingCategoriaId === categoria.id ? (
                    <Button
                      variant="primary"
                      onClick={() => handleSaveClick(categoria)}
                      disabled={!editCategoria.nome.trim()}
                    >
                      <FaSave />
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => handleEditClick(categoria)}
                    >
                      <FaEdit />
                    </Button>
                  )}
                </Col>
              </Row>
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseEditModal}>Fechar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AnimalForm;
