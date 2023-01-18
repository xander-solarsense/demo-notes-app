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

const siteName = "irvine"




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
 const getIsoTimeLastWeek = () => {
    var dtLastWeek = new Date(new Date().getTime() - (24 * 60 * 60 * 7 * 1000))
    var isoTimeLastWeek = toIsoString(dtLastWeek)

    return isoTimeLastWeek
 }
 const getIsoTimeLast30 = () => {
    var dtLast30 = new Date(new Date().getTime() - (24 * 60 * 60 * 30 * 1000))
    var isoTimeLast30 = toIsoString(dtLast30)

    return isoTimeLast30
 }

const EnergyBarIrvine = () => {
    const trackedTPDeviceID= `${siteName}_tracked_tp_energy`
    const trackedDayDeviceID = `${siteName}_tracked_day`
    const fixedTPDeviceID= `${siteName}_fixed_tp_energy`
    const fixedDayDeviceID = `${siteName}_fixed_day`
    const baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`

    const trackedSolcastDeviceID = `${siteName}_tracked_solcast`
    const fixedSolcastDeviceID = `${siteName}_fixed_solcast`

    const [trackedChart, setTrackedChart] = useState([])
    const [fixedChart, setFixedChart] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("Today")
    const [trackedEstimate, setTrackedEstimate] = useState([])
    const [fixedEstimate, setFixedEstimate] = useState([])
    
    const fetchData = async () => {
        var isoTimeYesterday = getIsoTimeYesterday()
        var isoTimeNow = getIsoTimeNow()
        var isoDateToday = isoTimeNow.slice(0,10)
        var isoTimeLastWeek = getIsoTimeLastWeek()
        var isoTimeLast30 = getIsoTimeLast30()
        var isoDateYesterday = isoTimeYesterday.slice(0,10)
       

        
        if (query == "Today") {
            var trackedInvQueryString = `${trackedTPDeviceID}/${isoDateToday}`
            var trackedSolQueryString = `${trackedSolcastDeviceID}/${isoDateToday}`
            var fixedInvQueryString = `${fixedTPDeviceID}/${isoDateToday}`
            var fixedSolQueryString = `${fixedSolcastDeviceID}/${isoDateToday}`
        } else if (query == "Yesterday") {
            var trackedInvQueryString = `${trackedTPDeviceID}/${isoDateYesterday}`
            var trackedSolQueryString = `${trackedSolcastDeviceID}/${isoDateYesterday}`
            var fixedInvQueryString = `${fixedTPDeviceID}/${isoDateYesterday}`
            var fixedSolQueryString = `${fixedSolcastDeviceID}/${isoDateYesterday}`
        } else if (query == "Last 7 Days") {
            var trackedInvQueryString = `${trackedDayDeviceID}/${isoTimeLastWeek}/${isoTimeNow}`
            var fixedInvQueryString = `${fixedDayDeviceID}/${isoTimeLastWeek}/${isoTimeNow}`
            
        } else if (query == "Last 30 Days") {
            var trackedInvQueryString = `${trackedDayDeviceID}/${isoTimeLast30}/${isoTimeNow}`
            var fixedInvQueryString = `${fixedDayDeviceID}/${isoTimeLast30}/${isoTimeNow}`
            
        }

        var trackedInvFullURL = `${baseURL}${trackedInvQueryString}`
        var trackedSolFullURL = `${baseURL}${trackedSolQueryString}`
        var fixedInvFullURL = `${baseURL}${fixedInvQueryString}`
        var fixedSolFullURL = `${baseURL}${fixedSolQueryString}`
       
        try{
        
        const trackedInvResult = await fetch(trackedInvFullURL)
        const trackedInvJson = await trackedInvResult.json()
        console.log("tracked inv full URL: ", trackedInvFullURL)
        setTrackedChart(trackedInvJson)

        const fixedInvResult = await fetch(fixedInvFullURL)
        console.log("fixed inv full url: ", fixedInvFullURL)
        const fixedInvJson = await fixedInvResult.json()
        setFixedChart(fixedInvJson)
        // console.log(`updated energy chart at: ${isoTimeNow}`)
        // console.log(`energy chart URL: ${invFullURL}`)
        // console.log('energy chart data: ',invJson)

        if (query == 'Today' | query == 'Yesterday') {
            const trackedSolResult = await fetch(trackedSolFullURL)
            const trackedSolJson = await trackedSolResult.json()
            setTrackedEstimate(trackedSolJson)

            const fixedSolResult = await fetch(fixedSolFullURL)
            const fixedSolJson = await fixedSolResult.json()
            setFixedEstimate(fixedSolJson)
        }

        // console.log(`updated energy chart at: ${isoTimeNow}`)
        // console.log(`energy chart URL: ${invFullURL}`)
        
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
    if (query == "Today" | query == "Yesterday"){
    

    let trackedInvData = trackedChart.Items
    // console.log("tracked inv data: ", trackedInvData)
    let trackedSolData = trackedEstimate.Items

    let fixedInvData = fixedChart.Items
    // console.log("fixed inv data: ", fixedInvData)
    let fixedSolData = fixedEstimate.Items

    const trackedCombinedData = trackedSolData.map(x => ({...x, ...trackedInvData.find(tp_energy => tp_energy.trading_period === x.trading_period)}) )
    console.log("Tracked energy bar data", trackedCombinedData)
    console.log("Tracked PV estimate data", trackedCombinedData.map(x => x.pv_estimate))

    const fixedCombinedData = fixedSolData.map(x => ({...x, ...fixedInvData.find(tp_energy => tp_energy.trading_period === x.trading_period)}) )
    console.log("Fixed energy bar data", fixedCombinedData)
    console.log("Fixed PV estimate data", fixedCombinedData.map(x => x.pv_estimate))

    const trackedEstimated = trackedCombinedData.map(x => x.pv_estimate)
    const fixedEstimated = fixedCombinedData.map(x => x.pv_estimate)

    const totalEstimated = trackedEstimated.map((v,i) => v + fixedEstimated[i])

    var data = {
        labels: trackedCombinedData.map(x => x.trading_period),
        datasets: [{
            type: 'line',
            label: `Estimated Energy`,
            data: totalEstimated,
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
        }
        ,
        {
            type: 'bar',
            lineTension: 0.3,
            pointRadius: 1,
            label: `Tracked Energy`,
            data: trackedCombinedData.map(x => x.tp_energy),
            backgroundColor: [
                'blue',
            ],
            borderColor: [
                'blue',
            ],
            borderWidth: 0,
            datalabels: {
                display: false
              },
            borderRadius: 3

        },
        {
            type: 'bar',
            lineTension: 0.3,
            pointRadius: 1,
            label: `Fixed Energy`,
            data: fixedCombinedData.map(x => x.tp_energy),
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
            stacked: true,
            title: {
                display: true,
                text: 'Trading Period'
            }
        },
        y: {
            stacked: true,
            title: {
                display: true,
                text: 'Power in Wh'
            },
            min: 0
        }
     }
}
    } else if (query == "Last 7 Days" | query == "Last 30 Days") {
        let trackedInvData = trackedChart.Items
        console.log("tracked data: ", trackedInvData)
        let fixedInvData = fixedChart.Items
        console.log("fixed data: ", fixedInvData)

        const trackedEstimated = trackedInvData.map(x => x.day_total_estimated/1000)
        const fixedEstimated = fixedInvData.map(x => x.day_total_estimated/1000)

        const totalEstimated = trackedEstimated.map((v,i) => v + fixedEstimated[i])

    var data = {
        labels: trackedInvData.map(x => x.date),
        datasets: [{
            type: 'line',
            label: `Estimated Energy`,
            data: totalEstimated,
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
            label: `Tracked Energy`,
            data: trackedInvData.map(x => x.day_total_energy/1000),
            backgroundColor: [
                'blue',
            ],
            borderColor: [
                'blue',
            ],
            borderWidth: 0,
            datalabels: {
                display: false
              },
            borderRadius: 3

        },
        {
        type: 'bar',
        lineTension: 0.3,
        pointRadius: 1,
        label: `Fixed Energy`,
        data: fixedInvData.map(x => x.day_total_energy/1000),
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
        borderRadius: 3}
    ]
    }
    var options = {
        plugins: {
            legend: {
              display: false
            },  
            title:{
                display: true,
                text: `Energy per Day ${query}`
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
                stacked: true,
                type: 'time',
                time: {
                    unit: 'day',
                    
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Power in kWh'
                },
                min: 0
            }
         }
    }}
    return (
        <div>
            <Container className="mt-2">
                <ButtonGroup size="sm" className="mb-3">
                    <Button onClick = {() => {
                        setQuery("Today")
                        }}>Today
                    </Button>
                    <Button onClick = {() => {
                        setQuery("Yesterday")
                        }}>Yesterday
                    </Button>
                    <Button onClick = {() => {
                        setQuery("Last 7 Days")
                        }}>Last 7 Days
                    </Button>
                    <Button onClick = {() => {
                        setQuery("Last 30 Days")
                        }}>Last 30 Days
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

export default EnergyBarIrvine