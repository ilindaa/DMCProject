import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavbarComponent() {
    return (
      <>
            <Navbar expand="lg" className="bg-body-tertiary" style={{ marginBottom: '3rem' }}>
                <Container>
                  <Navbar.Brand href="/">Art Reference Tool</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="me-auto">
                          <Nav.Link href="/">Home</Nav.Link>
                          <Nav.Link href="/login">Login</Nav.Link>
                          <Nav.Link href="/sign-up">Sign Up</Nav.Link>
                          <Nav.Link href="/add-content">Add Content</Nav.Link>
                          <NavDropdown title="Admin" id="basic-nav-dropdown">
                              <NavDropdown.Item href="/approve-content">Approve Content</NavDropdown.Item>
                              <NavDropdown.Divider />
                              <NavDropdown.Item href="/add-content">Add Content</NavDropdown.Item>
                              <NavDropdown.Item href="/edit-content">Edit Content</NavDropdown.Item>
                              <NavDropdown.Item href="/delete-content">Delete Content</NavDropdown.Item>
                          </NavDropdown>
                      </Nav>
                  </Navbar.Collapse>
              </Container>
          </Navbar>
      </>
  );
}

export default NavbarComponent;