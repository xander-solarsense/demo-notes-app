import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
import {Line} from 'react-chartjs-2'
import Container from 'react-bootstrap/Container'


ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
)

export default function SpotPrice_2() {
    const [chart, setChart] = useState([])

    var baseURL = 'https://api.coinranking.com/v2/coins/?limit=12'
    var proxyURL = 'https://cors-anywhere.herokuapp.com/'
    var coinsApiKey = "coinrankingc09a5b58a49c10fd627ebb8ded9e4aca0e271a998cd546f8"

    useEffect(() => {
        const fetchCoins = async () => {
            await fetch(`${proxyURL}${baseURL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': `${coinsApiKey}`,
                    'Access-Control-Allow-Origin': '*'

                }
            }).then((response) => {
                console.log(response)
                response.json()
                .then((json) => {
                    // console.log(json.data)
                    setChart(json.data)
                })
            }).catch(error => {
                console.log(error);
            })
            }
        fetchCoins()
    }, [baseURL, proxyURL, coinsApiKey])
console.log(chart.coins)
    var data = {
        labels: chart?.coins?.map(x => x.name),
        datasets: [{
            label: `${chart?.coins?.length} Coins Available`,
            data: chart?.coins?.map(x => x.price),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
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

