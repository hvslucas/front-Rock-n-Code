import { Navbar, Container, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = ({ theme, toggleTheme }) => {
  // Define os tons de cinza: o padrão do Bootstrap (claro) e um cinza quase preto (escuro)
  const navBackgroundColor = theme === 'dark' ? '#121212' : '#212529';

  return (
    <Navbar variant="dark" expand="lg" className="shadow-sm" style={{ backgroundColor: navBackgroundColor }}>
      <Container>
        <Navbar.Brand as={Link} to="/">Rock 'n' Code</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
            <Nav.Link as={Link} to="/produtos">Produtos</Nav.Link>
            <Nav.Link as={Link} to="/vendas">Vendas</Nav.Link>
          </Nav>
          
          <Form className="d-flex align-items-center">
            <Form.Check 
              type="switch"
              id="theme-switch"
              label={theme === 'dark' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="mt-1 text-light" // Força o texto a ser claro, já que a barra é sempre escura
            />
          </Form>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;