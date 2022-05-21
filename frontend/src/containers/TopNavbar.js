import { LinkContainer} from "react-router-bootstrap"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"

export default function TopNavbar() {
    return (
      <Container>
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
        <LinkContainer to="/">
        <Navbar.Brand className="font-weight-bold text-muted">
            SolarSense
        </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <Nav>
            <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
                <Nav.Link>Signup</Nav.Link>
            </LinkContainer>
            
            
           
            </Nav>
        </Navbar.Collapse>
        
    </Navbar>
    </Container>
    )};