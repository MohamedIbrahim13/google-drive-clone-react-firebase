import { Navbar, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"

function NavbarComp() {
  return (
    <Navbar bg="light" expand="sm">
      <Navbar.Brand as={Link} to="/">
        G-Drive
      </Navbar.Brand>
      <Nav>
        <Nav.Link as={Link} to="/user">
          Profile
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default NavbarComp