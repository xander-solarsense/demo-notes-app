import React, { useState, useEffect } from "react";
import { LinkContainer} from "react-router-bootstrap"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Login from "./containers/login";
import Signup from "./containers/signup";
import NotFound from "./containers/NotFound";
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./lib/errorLib";
import Dashboard from './containers/Dashboard'
import "./App.css"
import Test from './containers/Test'

export default function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e)
      }
    }
  
    setIsAuthenticating(false);
  }

async function handleLogout() {
  await Auth.signOut();

  userHasAuthenticated(false);
  navigate("login")

}
  return (
    !isAuthenticating && (
      <div>
        <Container fluid>
          <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
            <LinkContainer to="/">
              <Navbar.Brand className="font-weight-bold text-muted">
                <img 
                src="../mediumSolarSense.png"
                alt="sun icon"
                height="70"
                width="170"
                />
              </Navbar.Brand>
            </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {isAuthenticated ? (
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                <>
                  {/* <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer> */}
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
          </Navbar>
        </Container>
        
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={isAuthenticated ? <Signup /> : <Login />}/>
          <Route path="dashboard" element={<Dashboard/>} />
          {/* <Route path="test" element={<Test/>} /> */}
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </AppContext.Provider>
      </div>
    )
)};

