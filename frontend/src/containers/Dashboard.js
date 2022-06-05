import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import PowerBar from './PowerBar'
import EnergyBarTP from './EnergyBarTP'
import Container from 'react-bootstrap/Container'
import RevenueBarTP from './RevenueBarTP'
import { useAppContext } from "../lib/contextLib";
import Login from "./login.js"


const Dashboard = () => {
  const { isAuthenticated } = useAppContext();
  const renderLander = () => {
    return(
      <div>
        <Container>
          <h1 className='text-center'>Welcome to the SolarSense Dashboard!</h1>
          <Login />
        </Container>
      </div>
    )
  }
  const renderDashboard = () => {
    return (
        <div>
            <Container>
          <Row>
          <Col lg={5}>
            <EnergyBarTP/>    
          </Col>
            <Col lg={5}>
                <RevenueBarTP/>
            </Col>
            <Col lg={2}>
            <PowerBar/>
            </Col>
        </Row>
        </Container>
        </div>
    )
  }
  return (
    <div>
      {isAuthenticated ? renderDashboard() : renderLander()}
    </div>
  )
}

export default Dashboard