import React, { useState, useEffect } from "react";
import { LinkContainer} from "react-router-bootstrap"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Login from "./containers/login";
import Signup from "./containers/signup";
import Notes from "./containers/Notes"

import NotFound from "./containers/NotFound";
import {
  Routes,
  Route,
  useNavigate,
  Navigate
} from "react-router-dom";
import Home from "./containers/home"
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./lib/errorLib";
import NewNote from "./containers/NewNote";
import Testf from "./containers/Testf"
import PowerBar from "./containers/PowerBar"
import SpotPrice_2 from "./containers/SpotPrice_2"
import SpotPrice2 from "./containers/SpotPrice2"
import RevenueChart from "./containers/RevenueChart";
import RevenueBarTP from "./containers/RevenueBarTP";
import EnergyBarTP from "./containers/EnergyBarTP";
import Dashboard from "./containers/Dashboard"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"





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
        {/* <Container>
          <Row>
          <Col lg={8}>
            <EnergyBarTP/>    
          </Col>
            <Col lg={4}>
                <Test/>
            </Col>
        </Row>
        <Row>
            <Col lg={8}>
            <RevenueBarTP/>
            </Col>
        </Row>
        </Container> */}
         {/* <Container>
          <Test />
          <Testf />
        </Container> */}
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="spotprice" element={<SpotPrice_2/>} /> */}
          {/* <Route path="spotprice2" element={<SpotPrice2/>} /> */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          {/* <Route path="power" element={<PowerBar/>} /> */}
          {/* <Route path="revenueline" element={<RevenueChart/>} /> */}
          {/* <Route path="revenuebar" element={<RevenueBarTP/>} /> */}
          {/* <Route path="energy" element={<EnergyBarTP/>} /> */}
          <Route path="dashboard" element={<Dashboard/>} />
          
          

        
         

          {/* <Route 
            path="notes/new" 
            element={isAuthenticated? <NewNote /> : <Login/>
            }
          >
            
          </Route> */}
          {/* <Route 
            path="notes/:id" 
            element={isAuthenticated? <Notes /> : <Login/>} 
          /> */}
          
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </AppContext.Provider>
      </div>
    )
)};

