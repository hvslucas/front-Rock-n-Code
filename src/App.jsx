import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import Home from './pages/Home';
import ClientesList from './pages/ClientesList';
import ProdutosList from './pages/ProdutosList';
import VendasList from './pages/VendasList'; // <-- Importação nova
import NovaVenda from './pages/NovaVenda';   // <-- Importação nova

const Layout = () => (
  <>
    <Header />
    <Container className="mt-4">
      <Row>
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="clientes" element={<ClientesList />} />
          <Route path="produtos" element={<ProdutosList />} />
          {/* Rotas de Vendas */}
          <Route path="vendas" element={<VendasList />} />
          <Route path="vendas/nova" element={<NovaVenda />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;