import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import PowerBar from './PowerBar'
import EnergyBarTP from './EnergyBarTP'
import Container from 'react-bootstrap/Container'
import RevenueBarTP from './RevenueBarTP'
import { useAppContext } from "../lib/contextLib";
import Login from "./login.js"
import Weather from './Weather'
import SpotLine from './SpotLine'
import Card from 'react-bootstrap/Card'
import DashCard from './DashCard'

import Status from './Status'

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
            <Row lg={2}>
              <Col lg={9}>
                <DashCard/>
              </Col>
              <Col lg={3}>
                <Status/>
              </Col>
            </Row>
            
            <Card>
              <Row lg={3}>
                <Col lg={6}>
                  <EnergyBarTP/>   
                </Col>
                <Col lg ={2}>
                  <PowerBar/>
                </Col>
                <Col lg={4}>
                  <Weather/>
                </Col>
              </Row>
            </Card>
            
            <Row lg={2}>
              <Col >
                <Card className='mt-3 mb-3'>
                  <RevenueBarTP/>
                </Card>
              </Col>
              <Col>
                <Card className='mt-3 mb-3'>
                  <SpotLine />
                </Card>
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