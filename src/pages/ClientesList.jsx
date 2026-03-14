import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { api } from '../services/api';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para gerir o feedback visual
  const [alerta, setAlerta] = useState({ show: false, variant: '', message: '' });

  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCliente, setCurrentCliente] = useState({ id: null, nome: '', email: '', contato: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  const mostrarAlerta = (variant, message) => {
    setAlerta({ show: true, variant, message });
    setTimeout(() => setAlerta({ show: false, variant: '', message: '' }), 4000);
  };

  const carregarClientes = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/clientes');
      setClientes(data);
    } catch (error) {
      mostrarAlerta('danger', 'Erro ao carregar os clientes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleCloseForm = () => setShowFormModal(false);
  
  const handleShowNew = () => {
    setIsEditing(false);
    setCurrentCliente({ id: null, nome: '', email: '', contato: '' });
    setShowFormModal(true);
  };
  
  const handleShowEdit = (cliente) => {
    setIsEditing(true);
    setCurrentCliente(cliente);
    setShowFormModal(true);
  };

  const handleCloseDelete = () => setShowDeleteModal(false);
  
  const handleShowDelete = (cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente({ ...currentCliente, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await api.put(`/clientes/${currentCliente.id}`, currentCliente);
        mostrarAlerta('success', 'Cliente atualizado com sucesso!');
      } else {
        await api.post('/clientes', currentCliente);
        mostrarAlerta('success', 'Novo cliente registado com sucesso!');
      }
      handleCloseForm();
      carregarClientes(); // Recarrega a lista
    } catch (error) {
      mostrarAlerta('danger', 'Ocorreu um erro ao salvar o cliente.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/clientes/${clienteToDelete.id}`);
      mostrarAlerta('success', 'Cliente eliminado com sucesso!');
      handleCloseDelete();
      carregarClientes(); // Recarrega a lista
    } catch (error) {
      mostrarAlerta('danger', 'Erro ao tentar eliminar o cliente.');
    }
  };

  return (
    <Container className="mt-4">
      {alerta.show && (
        <Alert variant={alerta.variant} onClose={() => setAlerta({ ...alerta, show: false })} dismissible>
          {alerta.message}
        </Alert>
      )}

      <Row className="mb-3 align-items-center">
        <Col><h2>Gestão de Clientes</h2></Col>
        <Col className="text-end">
          <Button variant="success" onClick={handleShowNew} disabled={isLoading}>
            + Novo Cliente
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Contato</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan="5" className="text-center">A processar...</td></tr>
          ) : clientes.length === 0 ? (
            <tr><td colSpan="5" className="text-center">Nenhum cliente cadastrado.</td></tr>
          ) : (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td><td>{cliente.nome}</td><td>{cliente.email}</td><td>{cliente.contato}</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2" onClick={() => handleShowEdit(cliente)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleShowDelete(cliente)}>Eliminar</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal Formulário */}
      <Modal show={showFormModal} onHide={handleCloseForm}>
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" name="nome" value={currentCliente.nome} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" name="email" value={currentCliente.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contato</Form.Label>
              <Form.Control type="text" name="contato" value={currentCliente.contato} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Salvar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Eliminar */}
      <Modal show={showDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton><Modal.Title>Confirmar Exclusão</Modal.Title></Modal.Header>
        <Modal.Body>Tem certeza que deseja eliminar o cliente <strong>{clienteToDelete?.nome}</strong>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClientesList;