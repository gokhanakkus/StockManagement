import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { logout, getUsername } from '../api/authService'

function NavigationBar() {
  const navigate = useNavigate()
  const username = getUsername()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Stok Yönetim
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              Ürünler
            </Nav.Link>
            <Nav.Link as={Link} to="/movements">
              Stok Hareketleri
            </Nav.Link>
          </Nav>
          <Nav className="align-items-lg-center">
            <Navbar.Text className="me-3">{username}</Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Çıkış
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar
