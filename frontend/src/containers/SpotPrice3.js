import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/row'
import Col from 'react-bootstrap/col'


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};



export const data1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [-900,200,-300,1200,1800,1300,600],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [900,100,300,-200,-1500,-1200,0],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export const data2 = {
  labels: ['August', 'September', 'October', 'November', 'December', 'January', 'February'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [900,-200,300,-1200,-1800,-1300,-400],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [-900,-100,-300,200,1500,1200,0],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export default function SpotPrice3() {
  return (
  <Container>
    <Row>
      <Col>
    <Line options={options} data={data1} />
      </Col>
      <Col>
      <Line options={options} data={data2} />
      </Col>
    </Row>
  </Container>

  );
}
