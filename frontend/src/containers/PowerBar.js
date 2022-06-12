import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title } from 'chart.js'
import {Bar} from 'react-chartjs-2'
import Container from 'react-bootstrap/Container'
import 'date-fns'
import 'chartjs-adapter-date-fns'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ChartDataLabels from 'chartjs-plugin-datalabels'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    ChartDataLabels
)
function toIsoString(date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            return (num < 10 ? '0' : '') + num;
        };
  
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
  }
  
  

const PowerBar = () => {
    var dt = new Date();
    var dtYesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
    var isoTimeYesterday = toIsoString(dtYesterday)
    var isoTimeNow = toIsoString(dt)
    var isoDateToday = isoTimeNow.slice(0,10)
    var device_id = 'x_inv_2s'
    // var beginsWithQueryString = `${device_id}/${isoDateToday}`
    // var lastDayQueryString = `${device_id}/${isoTimeYesterday}/${isoTimeNow}`
    var limitQueryString = `${device_id}/${isoDateToday}/limit/1`
    // var limitQueryString = `${device_id}/2022-05-31/limit/1`

    
    var baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`
    
   
    
    const [chart, setChart] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    // const [query, setQuery] = useState(beginsWithQueryString)
    // const [seconds,setSeconds] = useState(0)
    var fullURL = `${baseURL}${limitQueryString}`
    
    const fetchData = async () => {
      // console.log("before fetch",chart)
      // console.log("updating power")
      setIsError(false);
      // setIsLoading(true);
      try{
      const result = await fetch(`${fullURL}`)
      const json = await result.json()
      // console.log({fullURL})
      // console.log("json", json)
      setChart(json)
      console.log("current power",chart)
      } catch (error) {
          setIsError(true);
      }
      setIsLoading(false);
  };
    useEffect(() => {
        fetchData()
        
        const intervalId = setInterval(() => {
            console.log("updated power bar")
            fetchData()
        },5000)
        return () => clearInterval(intervalId)
    }, []);
    
    

    if (! isLoading) {
    
    const current_pwr = chart.Items.map(x => x.current_pwr)
    const rand_test = Math.round(Math.random()*5000)
    const pwr_percent = Math.round((current_pwr/5000)*100)
    const randMulti1 = (Math.random()/10)+1
    const randMulti2 = (Math.random()/10)+1
    const fakeData1 = Math.floor(randMulti1*current_pwr)
    const fakeData2 = Math.floor(randMulti2*current_pwr)
    const labels = [[`${pwr_percent} %`,"Phase 1"],[`${Math.round((fakeData1/5000)*100)} %`,"Phase 2"],[`${Math.round((fakeData2/5000)*100)} %`,"Phase 3"]]
   
    if (pwr_percent > 60) {
        var barColor = 'green'
    } else if (pwr_percent > 20) {
        var barColor = 'orange'
    } else {
        var barColor = 'red'
    }
    var data = {
        labels,
        datasets: [
        {
          label: 'Phase Data',
          data: [current_pwr, fakeData1, fakeData2],
        //   data: inv_pwr,
          datalabels: {
              formatter: (val) => {
                return val + ' Wh'
              },
              color: 'white'
            },
          backgroundColor: barColor,
          barPercentage: .9,
          categoryPercentage: .9,
        //   minBarLength: 200
          // borderRadius: 20,
          borderSkipped: 'bottom',
          
          },
          
          {
            labels: 'Phase Top',
            data: [5000-current_pwr, 5000-fakeData1, 5000-fakeData2],
            backgroundColor: ['transparent'],
            borderColor: barColor,
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: ['bottom','bottom','bottom'],
            datalabels: {
              display: false
            },
            barPercentage: .9,
            categoryPercentage: .9,
            // minBarLength: 200
          },
          
          // {
          //   label: 'Dataset 3',
          //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
          //   backgroundColor: 'rgb(53, 162, 235)',
          // },
        ],
      };
    var options = {
        
        // barThickness: 40,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: ['  Power', '  Max 5000 Wh per Phase'],
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 0.5,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
              borderColor: 'transparent'
      
            }
          },
          y: {
            stacked: true,
            grid: {
              display: false,
              borderColor: 'transparent'
            },
            ticks: {
                display: false
            }
          },
        },
      
    }
    return (
    //    <div>
    //     <Row>
    //     <Col>
    //     <div>
    //         <Testf />
    //     </div>
    //     </Col>
    //    <Col>
        <div style={{height:300, width:190}}>
            
                <Bar 
                data = {data}
                options = {options}
                
                />
               
            
        </div>
        // </Col>
        // </Row>
        // </div>
    )
} else {
  return (
    <div>
      <h3 className='text-center'>Loading Power...</h3>
    </div>
  )
}
}
export default PowerBar