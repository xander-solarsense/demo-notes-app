import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Interaction, Tooltip, TimeSeriesScale, Title, Legend } from 'chart.js'
import {Line} from 'react-chartjs-2'
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
    Legend
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
  
  

export default function Testf() {
    var dt = new Date();
    var dtYesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
    var isoTimeYesterday = toIsoString(dtYesterday)
    var isoTimeNow = toIsoString(dt)
    var isoDateToday = isoTimeNow.slice(0,10)
    var device_id = 'x_inv_5'
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
        const intervalId = setInterval(() => {
            console.log("updated")
            fetchData()
        },6000)
        return () => clearInterval(intervalId)
    }, [baseURL,fullURL]);
    
    

    if (! isLoading) {
    
    const original = chart.Items
    console.log("original",original)
    const result=[]
    
    if (original.length) {
        // result.push(original[0]);
        
        for (let index = 1; index < original.length; ++index) {
            var lastEntry = original[index-1]
            var entry = {...original[index]};
            entry.x_energy -= lastEntry.x_energy;
            result.push(entry)
            lastEntry = entry
        }   
    }
    console.log("result", result)
    var data = {
        labels: result.map(x => x.timestamp),
        datasets: [{
            // lineTension: 0.8,
            pointRadius: 1,
            label: `Wh`,
            data: result.map(x => x.x_energy),
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
        // plugins: {
        //     title:{
        //         display: true,
        //         text: `Energy produced by ${device_id}`
        //         },
        // },
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
                type: 'time',
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Energy in Wh'
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