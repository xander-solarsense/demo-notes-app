import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title } from 'chart.js'
import {Bar} from 'react-chartjs-2'
import 'date-fns'
import 'chartjs-adapter-date-fns'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Spinner from 'react-bootstrap/Spinner'

const siteName = "te_anga"
const siteMaxPower = 15840

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    ChartDataLabels
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

const PowerBar = () => {
    const device_id = `${siteName}_2s`
    
    const [chart, setChart] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    
    
    const fetchData = async () => {
      var isoTimeNow = getIsoTimeNow()
      var isoDateToday = isoTimeNow.slice(0,10)
      var limitQueryString = `${device_id}/${isoDateToday}/limit/1`
      var baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`
      var fullURL = `${baseURL}${limitQueryString}`
  
      try{
      const result = await fetch(`${fullURL}`)
      const json = await result.json()
      // console.log({fullURL})
      setChart(json)
      console.log(`Updated current power: ${json.Items[0].current_pwr}Wh at ${isoTimeNow}`)
      console.log(`power bar URL: ${fullURL}`)
      
      } catch (error) {
          console.log(error);
      }
      setIsLoading(false);
  };
    useEffect(() => {
        fetchData()
        
        const intervalId = setInterval(() => {
            fetchData()
        },5000)
        return () => clearInterval(intervalId)
    }, []);
    
    

    if (! isLoading) {

    const current_pwr = chart.Items.map(x => x.current_pwr)
    const pwr_percent = Math.round((current_pwr/siteMaxPower)*100)
    const labels = [`${pwr_percent} %`]
    
    if (pwr_percent > 60) {
        var barColor = 'green'
    } else if (pwr_percent > 20) {
        var barColor = 'orange'
    } else {
        var barColor = 'red'
    }
    var data = {
        labels,
        datasets: [
        {
          label: 'Phase Data',
          data: [current_pwr],
          datalabels: {
              formatter: (val) => {
                return val + ' Wh'
              },
              color: 'white'
            },
          backgroundColor: barColor,
          barPercentage: .7,
          categoryPercentage: .7,
          borderSkipped: 'bottom',
          
          },
          
          {
            labels: 'Phase Top',
            data: [siteMaxPower-current_pwr],
            backgroundColor: ['transparent'],
            borderColor: barColor,
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: ['bottom'],
            datalabels: {
              display: false
            },
            barPercentage: .7,
            categoryPercentage: .7,
          },
        ],
      };
    var options = {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: ['  Power', '  Max 15840 Wh'],
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      // aspectRatio: 0.5,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
            borderColor: 'transparent'
    
          }
        },
        y: {
          stacked: true,
          grid: {
            display: false,
            borderColor: 'transparent'
          },
          ticks: {
              display: false
          }
        },
      },
      
    }
    return (
      <div style={{height:340, width:120}}>
        <Bar 
        data = {data}
        options = {options}
        />
      </div>
    )
} else {
  return (
    <div>
      <Spinner animation="border" />
    </div>
  )
}
}
export default PowerBar