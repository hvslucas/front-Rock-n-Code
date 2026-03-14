import { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const VendasList = () => {
  const [vendas, setVendas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alerta, setAlerta] = useState({ show: false, variant: '', message: '' });

  const carregarVendas = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/vendas');
      setVendas(data);
    } catch (error) {
      setAlerta({ 
        show: true, 
        variant: 'danger', 
        message: 'Erro ao carregar o histórico de vendas do servidor.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarVendas();
  }, []);

  return (
    <Container className="mt-4">
      {alerta.show && (
        <Alert variant={alerta.variant} onClose={() => setAlerta({ ...alerta, show: false })} dismissible>
          {alerta.message}
        </Alert>
      )}

      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Histórico de Vendas</h2>
        </Col>
        <Col className="text-end">
          <Button variant="success" as={Link} to="/vendas/nova" disabled={isLoading}>
            + Nova Venda
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID da Venda</th>
            <th>Cliente (ID)</th>
            <th>Data</th>
            <th>Valor Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
             <tr>
               <td colSpan="4" className="text-center">A carregar dados do servidor...</td>
             </tr>
          ) : vendas.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">Nenhuma venda registada.</td>
            </tr>
          ) : (
            vendas.map((venda) => (
              <tr key={venda.id}>
                <td>{venda.id}</td>
                {/* Como salvamos o clienteId no payload, exibimos ele aqui. Num cenário real com junção de tabelas (JOIN), o backend enviaria o nome. */}
                <td>Cliente #{venda.clienteId}</td>
                <td>{venda.data}</td>
                <td>{Number(venda.total).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default VendasList;