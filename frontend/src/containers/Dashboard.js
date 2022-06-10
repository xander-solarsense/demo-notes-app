import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import PowerBar from './PowerBar'
import EnergyBarTP from './EnergyBarTP'
import Container from 'react-bootstrap/Container'
import RevenueBarTP from './RevenueBarTP'
import { useAppContext } from "../lib/contextLib";
import Login from "./login.js"
import SpotPrice from './SpotPrice'
import Weather from './Weather'
import Map from '../components/Map'
import SpotLine from './SpotLine'
import Card from 'react-bootstrap/Card'

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
            <Card>
              <Row lg={3}>
              <Col lg={6}>
                {/* <Card> */}
                  <EnergyBarTP/>   
                {/* </Card> */}
              </Col>
              <Col lg={2}>
                {/* <Card> */}
                <PowerBar/>
                {/* </Card> */}
              </Col>
              <Col lg={4}>
                {/* <Card> */}
                  <Weather/>
                {/* </Card> */}
              </Col>
            </Row>
            </Card>
            <Row lg={2}>
              <Col >
                <Card className='mt-3'>
                  <RevenueBarTP/>
                </Card>
              </Col>
              <Col>
                <Card className='mt-3'>
                  <SpotLine />
                </Card>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <Map/>
              </Col>
            </Row> */}
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