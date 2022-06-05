import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, TimeSeriesScale } from 'chart.js'
import {Line} from 'react-chartjs-2'
import Container from 'react-bootstrap/Container'
import 'date-fns'
import 'chartjs-adapter-date-fns'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'


ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Tooltip,
    TimeSeriesScale
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
  
  

export default function Test() {
    
    var dt = new Date();
    var dtYesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
    var isoTimeYesterday = toIsoString(dtYesterday)
    var isoTimeNow = toIsoString(dt)
    var device_id = 'x_inv_5'
    var beginsWithQueryString = `${device_id}/2022-05-30`
    var lastDayQueryString = `${device_id}/${isoTimeYesterday}/${isoTimeNow}`
    

    
    var baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`
    
   
    
    const [chart, setChart] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [query, setQuery] = useState(beginsWithQueryString)
    const [chartData, setChartData] = useState()
    const [chartOption, setChartOptions] = useState()
    
    var fullURL = `${baseURL}${query}`

    const transformJson = (chart) => {
        const result = []
        const original = chart.Items
        console.log("original",original)
        
    
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
        return result
    }
    
    useEffect(() => {
        const fetchData = async () => {
            // console.log("before fetch",chart)
            setIsError(false);
            // setIsLoading(true);
            try{
            const res = await fetch(`${fullURL}`)
            const json = await res.json()
            // console.log("json", json)
            setChart(json)
            transformJson(chart)
            } catch (error) {
                setIsError(true);
            }
            setIsLoading(false);
        };
        
        fetchData()
    }, [baseURL,fullURL]);
    
    var data = {
        labels: result?.map(x => x.timestamp),
        datasets: [{
            // lineTension: 0.8,
            pointRadius: 1,
            label: `Wh`,
            data: result?.map(x => x.x_energy),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    }
    var options = {
        interaction: {
            mode: 'index'
        },
        scales: {
            x: {
                grid: {
                    display: true
                },
                type: 'timeseries',
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                grid: {
                    display: true
                },
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Energy in Wh'
                }
            }
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        }
    }
    return (
        <div>
            <Container>
                <ButtonGroup size="sm" className="mb-3">
                    <Button onClick = {() => {
                        setQuery(lastDayQueryString)
                        console.log("query",{query})
                        console.log({fullURL})
                        }}>Last Day
                    </Button>
                    <Button onClick = {() => {
                        setQuery(beginsWithQueryString)
        
                        console.log({fullURL})
                        }}>Begins With
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
