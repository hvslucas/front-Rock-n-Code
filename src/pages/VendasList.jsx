import { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const VendasList = () => {
  // Dados simulados do histórico de vendas
  const [vendas] = useState([
    { id: 1, cliente: 'João Silva', data: '14/03/2026', total: 4500.00 },
    { id: 2, cliente: 'Maria Souza', data: '13/03/2026', total: 3200.00 },
  ]);

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Histórico de Vendas</h2>
        </Col>
        <Col className="text-end">
          {/* Botão que atua como Link para a rota de criação */}
          <Button variant="success" as={Link} to="/vendas/nova">
            + Nova Venda
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID da Venda</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Valor Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda) => (
            <tr key={venda.id}>
              <td>{venda.id}</td>
              <td>{venda.cliente}</td>
              <td>{venda.data}</td>
              <td>{Number(venda.total).toFixed(2)}</td>
            </tr>
          ))}
          {vendas.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">Nenhuma venda registada.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default VendasList;