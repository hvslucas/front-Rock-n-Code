import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import Home from './pages/Home';
import ClientesList from './pages/ClientesList';
import ProdutosList from './pages/ProdutosList';
import VendasList from './pages/VendasList';
import NovaVenda from './pages/NovaVenda';

// Componente Layout agora recebe propriedades de tema
const Layout = ({ theme, toggleTheme }) => (
  <>
    <Header theme={theme} toggleTheme={toggleTheme} />
    <Container className="mt-4">
      <Row>
        <Col>
          {/* O context permite passar dados para as páginas filhas (ex: para mudar a cor da tabela) */}
          <Outlet context={{ theme }} />
        </Col>
      </Row>
    </Container>
  </>
);

function App() {
  // Inicializa o tema lendo do localStorage, com fallback para 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  // Sempre que o tema mudar, atualiza a tag <html> e o localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Função para alternar entre dark e light
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<Home />} />
          <Route path="clientes" element={<ClientesList />} />
          <Route path="produtos" element={<ProdutosList />} />
          <Route path="vendas" element={<VendasList />} />
          <Route path="vendas/nova" element={<NovaVenda />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;