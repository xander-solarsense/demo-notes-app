import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, LineElement, BarElement, PointElement, CategoryScale, LinearScale, TimeScale, Interaction, Tooltip, TimeSeriesScale, Title, Legend } from 'chart.js'
import {Line} from 'react-chartjs-2'
import {Bar} from 'react-chartjs-2'
import Container from 'react-bootstrap/Container'
import 'date-fns'
import 'chartjs-adapter-date-fns'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ChartDataLabels from 'chartjs-plugin-datalabels'





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
    BarElement
    // Interaction
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
  
  

export default function RevenueChart() {
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
    const [isError, setIsError] = useState(false);
    const [query, setQuery] = useState(beginsWithQueryString)
    const [seconds,setSeconds] = useState(0)
    var fullURL = `${baseURL}${query}`
    
    useEffect(() => {
        
        const fetchData = async () => {
            // console.log("before fetch",chart)
            setIsError(false);
            // setIsLoading(true);
            try{
            const result = await fetch(`${fullURL}`)
            const json = await result.json()
            // console.log("json", json)
            setChart(json)
            } catch (error) {
                setIsError(true);
            }
            setIsLoading(false);
        };
        // const intervalId = setInterval(() => {
            console.log("updated")
            fetchData()
        // },6000)
        // return () => clearInterval(intervalId)
    }, [baseURL,fullURL]);
    
    

    if (! isLoading) {
    
    console.log("chart", chart)
    var data = {
        labels: chart.Items.map(x => x.trading_period),
        datasets: [{
            lineTension: 0.3,
            pointRadius: 1,
            label: `Revenue`,
            data: chart.Items.map(x => (x.tp_revenue).toFixed(2)),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 3,
            datalabels: {
                display: false
              },

        }]
    }
    var options = {
        plugins: {
            title:{
                display: true,
                text: `Revenue per Trading Period`
                },
        },
        plugins: {
            legend: {
              display: false
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
                    text: 'Revenue in $'
                },
                min: 0
            }
         }
    }
    return (
        <div>
            <Container>
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
                <Line
                data = {data}
                options = {options}
                />
            </Container>
        </div>
    )
}
}