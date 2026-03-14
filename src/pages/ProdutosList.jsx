import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { api } from '../services/api';

const ProdutosList = () => {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para gerir o feedback visual (Toasts/Alerts)
  const [alerta, setAlerta] = useState({ show: false, variant: '', message: '' });

  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduto, setCurrentProduto] = useState({ id: null, nome: '', categoria: '', preco: '', quantidade: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);

  const mostrarAlerta = (variant, message) => {
    setAlerta({ show: true, variant, message });
    setTimeout(() => setAlerta({ show: false, variant: '', message: '' }), 4000);
  };

  const carregarProdutos = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/produtos');
      setProdutos(data);
    } catch (error) {
      mostrarAlerta('danger', 'Erro ao carregar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleCloseForm = () => setShowFormModal(false);
  
  const handleShowNew = () => {
    setIsEditing(false);
    setCurrentProduto({ id: null, nome: '', categoria: '', preco: '', quantidade: '' });
    setShowFormModal(true);
  };
  
  const handleShowEdit = (produto) => {
    setIsEditing(true);
    setCurrentProduto(produto);
    setShowFormModal(true);
  };

  const handleCloseDelete = () => setShowDeleteModal(false);
  
  const handleShowDelete = (produto) => {
    setProdutoToDelete(produto);
    setShowDeleteModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduto({ ...currentProduto, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.put(`/produtos/${currentProduto.id}`, currentProduto);
        mostrarAlerta('success', 'Registo atualizado com sucesso!');
      } else {
        await api.post('/produtos', currentProduto);
        mostrarAlerta('success', 'Novo registo criado com sucesso!');
      }
      handleCloseForm();
      carregarProdutos(); // Atualiza a lista após salvar
    } catch (error) {
      mostrarAlerta('danger', 'Ocorreu um erro ao salvar as alterações.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/produtos/${produtoToDelete.id}`);
      mostrarAlerta('success', 'Registo eliminado com sucesso!');
      handleCloseDelete();
      carregarProdutos(); // Atualiza a lista após eliminar
    } catch (error) {
      mostrarAlerta('danger', 'Erro ao tentar eliminar o registo.');
    }
  };

  return (
    <Container className="mt-4">
      {/* Área de Notificações */}
      {alerta.show && (
        <Alert variant={alerta.variant} onClose={() => setAlerta({ ...alerta, show: false })} dismissible>
          {alerta.message}
        </Alert>
      )}

      <Row className="mb-3 align-items-center">
        <Col><h2>Catálogo</h2></Col>
        <Col className="text-end">
          <Button variant="success" onClick={handleShowNew} disabled={isLoading}>
            + Adicionar
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Qtd</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan="6" className="text-center">A processar...</td></tr>
          ) : produtos.length === 0 ? (
            <tr><td colSpan="6" className="text-center">Nenhum registo encontrado.</td></tr>
          ) : (
            produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.id}</td><td>{produto.nome}</td><td>{produto.categoria}</td>
                <td>{Number(produto.preco).toFixed(2)}</td><td>{produto.quantidade}</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2" onClick={() => handleShowEdit(produto)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleShowDelete(produto)}>Eliminar</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* O código dos Modais de Formulário e Exclusão permanece idêntico à versão anterior... */}
      <Modal show={showFormModal} onHide={handleCloseForm}>
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Editar' : 'Criar Novo'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3"><Form.Label>Nome</Form.Label><Form.Control type="text" name="nome" value={currentProduto.nome} onChange={handleChange} /></Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select name="categoria" value={currentProduto.categoria} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="Categoria A">Categoria A</option>
                <option value="Categoria B">Categoria B</option>
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Preço</Form.Label><Form.Control type="number" step="0.01" name="preco" value={currentProduto.preco} onChange={handleChange} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Quantidade</Form.Label><Form.Control type="number" name="quantidade" value={currentProduto.quantidade} onChange={handleChange} /></Form.Group></Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={handleCloseForm}>Cancelar</Button><Button variant="primary" onClick={handleSave}>Salvar</Button></Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton><Modal.Title>Atenção</Modal.Title></Modal.Header>
        <Modal.Body>Confirma a exclusão de <strong>{produtoToDelete?.nome}</strong>?</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={handleCloseDelete}>Cancelar</Button><Button variant="danger" onClick={handleDelete}>Confirmar</Button></Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProdutosList;