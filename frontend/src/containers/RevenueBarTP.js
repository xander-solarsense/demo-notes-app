import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, BarElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, TimeSeriesScale, Title, Legend } from 'chart.js'
import {Bar} from 'react-chartjs-2'
import Container from 'react-bootstrap/Container'
import 'date-fns'
import 'chartjs-adapter-date-fns'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Spinner from 'react-bootstrap/Spinner'

const siteName = "te_anga"

ChartJS.register(
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Tooltip,
    TimeSeriesScale,
    Title,
    ChartDataLabels,
    Legend,
    BarElement,
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
  
  const getIsoTimeYesterday = () => {
    var dtYesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
    var isoTimeYesterday = toIsoString(dtYesterday)

    return isoTimeYesterday
 }
  
 const getIsoTimeNow = () => {
    var dt = new Date();
    var isoTime = toIsoString(dt);
  
    return isoTime
  }

export default function RevenueBarTP() {

    const device_id = `${siteName}_tp`
    const baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`
    
    const [chart, setChart] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("Today")
    
    const fetchData = async () => {
        var isoTimeYesterday = getIsoTimeYesterday()
        var isoTimeNow = getIsoTimeNow()
        var isoDateToday = isoTimeNow.slice(0,10)
        var isoDateYesterday = isoTimeYesterday.slice(0,10)

        if (query == "Today") {
            var queryString = `${device_id}/${isoDateToday}`
        } else if (query == "Yesterday") {
            var queryString = `${device_id}/${isoDateYesterday}`
        }

        var fullURL = `${baseURL}${queryString}`

        try{
        const result = await fetch(`${fullURL}`)
        const json = await result.json()
        // console.log("json", json)x
        setChart(json)
        console.log(`Updated revenue chart at ${isoTimeNow}`, chart.Items)
        console.log(`Revenue chart URL: ${fullURL}`)
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
    
  
    var data = {
        labels: chart.Items.map(x => x.trading_period),
        datasets: [{
            lineTension: 0.3,
            pointRadius: 1,
            label: `Spot Revenue`,
            data: chart.Items.map(x => (x.tp_spot_revenue).toFixed(4)),
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

        },
        {
            lineTension: 0.3,
            pointRadius: 1,
            label: `Fixed Revenue`,
            data: chart.Items.map(x => (x.tp_fixed_revenue).toFixed(4)),
            backgroundColor: [
                'rgb(53, 162, 235)'
            ],
            borderColor: [
                'blue',
            ],
            borderWidth: 0,
            datalabels: {
                display: false
              },
            borderRadius: 3
        }
    ]
    }
    var options = {
        plugins: {
            legend: {
              display: true
            },  
            title:{
                display: true,
                text: `Revenue per Trading Period ${query}`
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
            <Container className='mt-3'>
                <ButtonGroup size="sm" className="mb-3">
                    <Button onClick = {() => {
                        setQuery("Today")
                        }}>Today
                    </Button>
                    <Button onClick = {() => {
                        setQuery("Yesterday")
                        }}>Yesterday
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