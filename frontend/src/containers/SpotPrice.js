import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, LineElement, BarElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, TimeSeriesScale, Title, Legend } from 'chart.js'

import {Bar} from 'react-chartjs-2'
import Container from 'react-bootstrap/Container'
import 'date-fns'
import 'chartjs-adapter-date-fns'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Spinner from 'react-bootstrap/Spinner'





ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Tooltip,
    TimeSeriesScale,
    Title,
    ChartDataLabels,
    Legend,
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
  
  

const SpotPrice = () => {
    var dt = new Date();
    var dtYesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
    var isoTimeYesterday = toIsoString(dtYesterday)
    var isoTimeNow = toIsoString(dt)
    var isoDateToday = isoTimeNow.slice(0,10)
    var device_id = 'x_inv_tp'
    // var beginsWithQueryString = `${device_id}/${isoTimeNow.slice(0,10)}`
    var beginsWithQueryString = `${device_id}/${isoDateToday}`
    var lastDayQueryString = `${device_id}/${isoTimeYesterday}/${isoTimeNow}`
    

    
    var baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`
    
   
    
    const [chart, setChart] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState(beginsWithQueryString)
    var fullURL = `${baseURL}${query}`
    
    const fetchData = async () => {
        // console.log("before fetch",chart)
        setIsError(false);
        // setIsLoading(true);
        try{
        const result = await fetch(`${fullURL}`)
        const json = await result.json()
        // console.log("json", json)
        setChart(json)
        console.log("updated spot price")
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };
    
    useEffect(() => {
        fetchData()
        
        const intervalId = setInterval(() => {
            fetchData()
        },60000)
        return () => clearInterval(intervalId)
    }, [query]);
    
    

    if (! isLoading) {
    
    console.log("chart", chart)
    var data = {
        labels: chart.Items.map(x => x.trading_period),
        datasets: [{
            lineTension: 0.3,
            pointRadius: 1,
            label: `Spot Price`,
            data: chart.Items.map(x => (x.spot_price).toFixed(2)),
            backgroundColor: [
                'rgba(0,128,0,0.8'
            ],
            borderColor: [
                'green',
            ],
            borderWidth: 0,
            datalabels: {
                display: false
              },
            borderRadius: 3

        }]
    }
    var options = {
        plugins: {
            
        },
        plugins: {
            legend: {
              display: false
            },  
            title:{
                display: true,
                text: `Spot Price HLY0331 per MWh ${isoDateToday}`
                }, 
        },
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false
        },
        
        scales: {
            x: {
                // type: 'time',
                title: {
                    display: true,
                    text: 'Trading Period'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Spot Price in $ per MWh'
                },
                min: 0
            }
         }
    }
    return (
        <div>
            <Container className='mt-3'>
                <ButtonGroup size="sm" className="mb-3">
                    <Button onClick = {() => {
                        setQuery(beginsWithQueryString)
        
                        console.log("fullURL",{fullURL})
                        }}>Today
                    </Button>
                    <Button onClick = {() => {
                        setQuery(lastDayQueryString)
                        console.log("query",{query})
                        console.log({fullURL})
                        }}>Last 24 Hours
                    </Button>
                    
                </ButtonGroup>
                <Bar
                data = {data}
                options = {options}
                />
            </Container>
        </div>
    )
} else {
    return(
        <div>
            <Spinner animation="border" />
        </div>
    )
}
}
export default SpotPrice