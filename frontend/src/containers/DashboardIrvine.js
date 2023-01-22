import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import PowerBar from './PowerBar'
import EnergyBarIrvine from './EnergyBarIrvine'
import Container from 'react-bootstrap/Container'
import RevenueBarTP from './RevenueBarTP'
import { useAppContext } from "../lib/contextLib";
import Login from "./login.js"
import WeatherIrvine from './WeatherIrvine'
import SpotLine from './SpotLine'
import Card from 'react-bootstrap/Card'
import DashCardIrvine from './DashCardIrvine'
import Errors from './Errors'

import StatusIrvine from './StatusIrvine'

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
                <DashCardIrvine/>
              </Col>
              <Col lg={3}>
                <StatusIrvine/>
              </Col>
            </Row>
            
            <Card>
              <Row lg={3}>
                <Col lg={6}>
                  <EnergyBarIrvine/>   
                </Col>
                <Col lg ={2}>
                  {/* <PowerBar/> */}
                </Col>
                <Col lg={4}>
                  <WeatherIrvine/>
                </Col>
              </Row>
            </Card>
            
            <Row lg={2}>
              <Col >
                <Card className='mt-3 mb-3'>
                  {/* <RevenueBarTP/> */}
                </Card>
              </Col>
              <Col>
                <Card className='mt-3 mb-3'>
                  <SpotLine />
                </Card>
              </Col>
            </Row>
            <Row>
            
              
              {/* <Errors/> */}
            
            
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