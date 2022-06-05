import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip } from 'chart.js'
import {Line} from 'react-chartjs-2'
import Container from 'react-bootstrap/Container'
import 'date-fns'
import 'chartjs-adapter-date-fns'
import axios from 'axios'


ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Tooltip
)

export default function Test() {
    const [chart, setChart] = useState([])

    var baseURL = 'https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/x_inv_1/2022-05-30'

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`${baseURL}`)
            .then((response) => {
            response.json()
            .then((json) => {
            setChart(json)
        })
    }).catch(error => {
        console.log(error)
    })
            
        }
        fetchData()
    }, [baseURL])

    console.log(chart)
    const original = chart.Items
    console.log("original",original)
    // const result = [];
    // if (original.length) {
    // // //     // Remember a copy of the first entry
    //     result.push({...original[0]});
    //     var lastEntry = result[0];
    //     for (let index = 1; index < original.length; ++index) {
    // //         // Get a copy of the original entry at this loop index
    //         const entry = {...original[index]};
    // //         // Subtract the previous entry values
    //         entry.energy_last_5 -= lastEntry.energy_last_5;
           
    // //         // Save it
    //         result.push(entry);
    // //         // Remember this for next time
    //         lastEntry = entry;
    //     }
    // }
    // console.log(result);
    var data = {
        labels: chart?.Items?.map(x => x.timestamp),
        datasets: [{
            // lineTension: 0.8,
            pointRadius: 1,
            label: `Wh`,
            data: chart?.Items?.map(x => x.x_energy),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            //     'rgba(54, 162, 235, 0.2)',
            //     'rgba(255, 206, 86, 0.2)',
            //     'rgba(75, 192, 192, 0.2)',
            //     'rgba(153, 102, 255, 0.2)',
            //     'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            //     'rgba(54, 162, 235, 1)',
            //     'rgba(255, 206, 86, 1)',
            //     'rgba(75, 192, 192, 1)',
            //     'rgba(153, 102, 255, 1)',
            //     'rgba(255, 159, 64, 1)'
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
                type: 'time',
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
                <Line
                data = {data}
                options = {options}
                
                />
            </Container>
        </div>
    )
}