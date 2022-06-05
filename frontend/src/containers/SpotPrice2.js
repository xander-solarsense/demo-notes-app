import React, {useState, useEffect} from 'react'
// import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
// import {Line} from 'react-chartjs-2'
import Container from 'react-bootstrap/Container'


// ChartJS.register(
//     LineElement,
//     PointElement,
//     CategoryScale,
//     LinearScale
// )

export default function SpotPrice2() {
    // const [chart, setChart] = useState([])

    var baseURL = 'https://emi.azure-api.net/real-time-prices/?$filter=TradingPeriodNumber eq 24'
    var proxyURL = 'https://cors-anywhere.herokuapp.com/'
    var coinsApiKey = "f0ab504f60704e0f9531c07e2a38713f"

    fetch(`${proxyURL}${baseURL}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': `${coinsApiKey}`,
            'Access-Control-Allow-Origin': '*'
        }

    }
    ).then(result => {
        console.log(result);
        return result.json();
    })
    .then(result =>{
        console.log(result);
     })
    .catch(e => console.log(e));
 }
      
//     useEffect(() => {
//         const fetchCoins = async () => {
//             await fetch(`${proxyURL}${baseURL}`, {
//                 method: 'GET',
//                 headers: {
                    
//                     'Ocp-Apim-Subscription-Key': `${coinsApiKey}`
                    

//                 }
//             }).then((response) => {
//                 console.log(response)
//                 response.json()
                
//                 .then((json) => {
//                     console.log(json)
//                     setChart(json.data)
//                 })
//             }).catch(error => {
//                 console.log(error);
//             })
//             }
//         fetchCoins()
//     }, [baseURL, proxyURL, coinsApiKey])
// console.log("chart", chart)
//     var data = {
//         labels: chart?.PointOfConnectionCode?.map(x => x.PointOfConnectionCode),
//         datasets: [{
//             label: `${chart?.DollarsPerMegawattHour?.length} Coins Available`,
//             data: chart?.DollarsPerMegawattHour?.map(x => x.DollarsPerMegawattHour),
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     }
//     var options = {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
    
//     return (
//         <div>
//             <Container>
//                 {/* <Line
//                 data = {data}
//                 options = {options}
                
//                 /> */}
//                 <p>{data}</p>
//             </Container>
//         </div>
//     )


