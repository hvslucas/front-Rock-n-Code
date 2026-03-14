import { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NovaVenda = () => {
  const navigate = useNavigate();

  // Dados simulados para popular os selects
  const clientes = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Maria Souza' },
  ];

  const produtos = [
    { id: 1, nome: 'Guitarra Fender Stratocaster', preco: 4500.00 },
    { id: 2, nome: 'Teclado Roland XPS-10', preco: 3200.00 },
    { id: 3, nome: 'Bateria Pearl Export', preco: 5500.00 },
  ];

  // Estados do formulário e carrinho
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedProduto, setSelectedProduto] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]);

  // Adicionar produto ao carrinho
  const handleAddProduto = () => {
    if (!selectedProduto || quantidade <= 0) return;

    const produto = produtos.find(p => p.id === parseInt(selectedProduto));
    if (produto) {
      const novoItem = {
        ...produto,
        quantidade: parseInt(quantidade),
        subtotal: produto.preco * quantidade
      };
      setCarrinho([...carrinho, novoItem]);
      
      // Resetar os campos de seleção de produto
      setSelectedProduto('');
      setQuantidade(1);
    }
  };

  // Remover item do carrinho
  const handleRemoverItem = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
  };

  // Finalizar a venda
  const handleConcluirVenda = () => {
    if (!selectedCliente || carrinho.length === 0) {
      alert('Por favor, selecione um cliente e adicione pelo menos um produto.');
      return;
    }
    // Aqui entraria a lógica de gravar a venda na API/Estado Global
    alert('Venda registada com sucesso!');
    navigate('/vendas'); // Redireciona de volta para a listagem
  };

  const totalVenda = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Nova Venda</h2>
        </Col>
      </Row>

      <Row>
        {/* Secção Esquerda: Seleção de Cliente e Produtos */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Dados da Encomenda</Card.Header>
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Label>Cliente</Form.Label>
                <Form.Select 
                  value={selectedCliente} 
                  onChange={(e) => setSelectedCliente(e.target.value)}
                >
                  <option value="">Selecione o cliente...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <hr />
              <h5 className="mb-3">Adicionar Produto</h5>

              <Form.Group className="mb-3">
                <Form.Label>Produto</Form.Label>
                <Form.Select 
                  value={selectedProduto} 
                  onChange={(e) => setSelectedProduto(e.target.value)}
                >
                  <option value="">Selecione o produto...</option>
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - R$ {p.preco.toFixed(2)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantidade</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1" 
                      value={quantidade} 
                      onChange={(e) => setQuantidade(e.target.value)} 
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end mb-3">
                  <Button variant="primary" className="w-100" onClick={handleAddProduto}>
                    Adicionar
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Secção Direita: Resumo (Carrinho) */}
        <Col md={6}>
          <Card>
            <Card.Header>Resumo da Encomenda</Card.Header>
            <Card.Body>
              <Table size="sm" responsive>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {carrinho.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle">{item.nome}</td>
                      <td className="align-middle">{item.quantidade}</td>
                      <td className="align-middle">R$ {item.subtotal.toFixed(2)}</td>
                      <td className="text-end">
                        <Button variant="danger" size="sm" onClick={() => handleRemoverItem(index)}>
                          X
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {carrinho.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        Nenhum produto adicionado
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              
              <h4 className="text-end mt-4 border-top pt-3">
                Total: R$ {totalVenda.toFixed(2)}
              </h4>
              
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 mt-3" 
                onClick={handleConcluirVenda}
                disabled={carrinho.length === 0 || !selectedCliente}
              >
                Concluir Venda
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NovaVenda;