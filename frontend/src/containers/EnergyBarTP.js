import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, LineElement, BarElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, TimeSeriesScale, Title, Legend } from 'chart.js'
import {Chart} from 'react-chartjs-2'
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
    BarElement
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
  
  const getIsoTimeNow = () => {
    var dt = new Date();
    var isoTime = toIsoString(dt);

    return isoTime
  }

 const getIsoTimeYesterday = () => {
    var dtYesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
    var isoTimeYesterday = toIsoString(dtYesterday)

    return isoTimeYesterday
 }

const EnergyBarTP = () => {
    const inv_device_id = 'x_inv_tp'
    const baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`

    const sol_device_id = 'x_inv_solcast'

    const [chart, setChart] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("Today")
    const [estimate, setEstimate] = useState([])
    
    const fetchData = async () => {
        var isoTimeYesterday = getIsoTimeYesterday()
        var isoTimeNow = getIsoTimeNow()
        var isoDateToday = isoTimeNow.slice(0,10)

        if (query == "Today") {
            var invQueryString = `${inv_device_id}/${isoDateToday}`
            var solQueryString = `${sol_device_id}/${isoDateToday}`
        } else if (query == "Last 24 Hours") {
            var invQueryString = `${inv_device_id}/${isoTimeYesterday}/${isoTimeNow}`
            var solQueryString = `${sol_device_id}/${isoTimeYesterday}/${isoTimeNow}`
        }

        var invFullURL = `${baseURL}${invQueryString}`
        var solFullURL = `${baseURL}${solQueryString}`
       
        try{
        const invResult = await fetch(invFullURL)
        const invJson = await invResult.json()
        setChart(invJson)
        console.log(`updated energy chart at: ${isoTimeNow}`)
        console.log(`energy chart URL: ${invFullURL}`)

        const solResult = await fetch(solFullURL)
        const solJson = await solResult.json()
        setEstimate(solJson)

        console.log(`updated energy chart at: ${isoTimeNow}`)
        console.log(`energy chart URL: ${invFullURL}`)
        
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };
    
    useEffect(() => {
        fetchData()
        
        // fetchData()
        const intervalId = setInterval(() => {
            fetchData()
        },60000)
        return () => clearInterval(intervalId)
    }, [query]);
    
    

    if (! isLoading) {
    
    

    let invData = chart.Items
    let solData = estimate.Items

    const combinedData = solData.map(x => ({...x, ...invData.find(tp => tp.trading_period === x.trading_period)}) )
    console.log("Energy bar data", combinedData)
    console.log("PV estimate data", combinedData.map(x => x.pv_estimate))

    var data = {
        labels: combinedData.map(x => x.trading_period),
        datasets: [{
            type: 'line',
            label: `Estimated Energy`,
            data: combinedData.map(x => x.pv_estimate),
            backgroundColor: [
                'green',
            ],
            borderColor: [
                'green',
            ],
            borderWidth: [
                2
            ],
            borderDash: [
                8,10
            ],
            pointRadius: 0,
        },
        {
            type: 'bar',
            lineTension: 0.3,
            pointRadius: 1,
            label: `Actual Energy`,
            data: combinedData.map(x => x.tp_energy),
            backgroundColor: [
                'orange',
            ],
            borderColor: [
                'orange',
            ],
            borderWidth: 0,
            datalabels: {
                display: false
              },
            borderRadius: 3

        },
    ]
    }
    var options = {
        plugins: {
            legend: {
              display: true
            },  
            title:{
                display: true,
                text: `Energy per Trading Period ${query}`
                }, 
            datalabels: {
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
                    text: 'Power in Wh'
                },
                min: 0
            }
         }
    }
    return (
        <div>
            <Container className="mt-2">
                <ButtonGroup size="sm" className="mb-3">
                    <Button onClick = {() => {
                        setQuery("Today")
                        }}>Today
                    </Button>
                    <Button onClick = {() => {
                        setQuery("Last 24 Hours")
                        }}>Last 24 Hours
                    </Button>
                    
                </ButtonGroup>
                <Chart
                type = 'bar'
                data = {data}
                options = {options}
                />
            </Container>
        </div>
    )
} else {
    return (
        <Spinner animation="border" />
    )
}
}

export default EnergyBarTP