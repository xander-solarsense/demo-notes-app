import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Spinner from 'react-bootstrap/Spinner'
import axios from 'axios'

const siteName = "te_anga"

const wattsToKWH = (watts) => {
    var KWH = (watts/1000).toFixed(1)
    KWH = `${KWH} kWh`

    return KWH
}

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

 const getIsoDateMinusDays = (days) => {
    var dtLastMonth = new Date(new Date().setDate(new Date().getDate()-days))
    var isoTimeLastMonth = toIsoString(dtLastMonth)
    var isoDateLastMonth = isoTimeLastMonth.slice(0,10)

    return isoDateLastMonth
 }

const formatDollars = (amount) => {
    amount = amount.toFixed(2)
    var formattedAmount = `$${amount}`

    return formattedAmount
}
const DashCard = () => {
    const [todayData,setTodayData] = useState()
    const [solcastData, setSolcastData] = useState()
    const [isLoading,setIsLoading] = useState(true)
    const [monthData, setMonthData] = useState()
    const baseURL = 'https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/'
    const todayDeviceID = `${siteName}_tp`
    const dayDeviceID = `${siteName}_day`
    const solcastDeviceID = `${siteName}_solcast`
    
    const fetchData = async() => {
        var isoTimeNow = getIsoTimeNow()
        var isoDateToday = isoTimeNow.slice(0,10)
        var isoDateMonthAgo = getIsoDateMinusDays(31)

        const todayQueryString = `${isoDateToday}`
        const monthQueryString = `${isoDateMonthAgo}/${isoDateToday}`

        const fullSolcastURL = `${baseURL}${solcastDeviceID}/${isoDateToday}`
        const fullMonthURL = `${baseURL}${dayDeviceID}/${monthQueryString}`
        const fullTodayURL = `${baseURL}${todayDeviceID}/${todayQueryString}`

        try {
            const monthResult = await axios.get(fullMonthURL)
            const monthData = monthResult.data.Items
            setMonthData(monthData)
            // console.log("month data: ", monthData)

            const todayResult = await axios.get(fullTodayURL)
            const todayData = todayResult.data.Items
            setTodayData(todayData)
            // console.log("today data: ", todayData)

            const solcastResult = await axios.get(fullSolcastURL)
            const solcastData = solcastResult.data.Items
            setSolcastData(solcastData)
            // console.log("solcast data: ", solcastData)

        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    } 
    useEffect(() => {
        fetchData()
        const intervalId = setInterval(() => {
            
            fetchData()
        },300000)
        return () => clearInterval(intervalId)
    },[])
    
    if (! isLoading) {
        const today = new Date()
        today.setHours(0,0,0,0)
        const yesterday = new Date(new Date().setDate(new Date().getDate()-1))
        const yesterdayStart = yesterday.setHours(0,0,0,0)
        const yesterdayEnd = yesterday.setHours(23,59,59,0)
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate()-7))
        sevenDaysAgo.setHours(0,0,0,0)
        const billingStart = new Date()
        billingStart.setHours(0,0,0,0)
        billingStart.setDate(1)
        var lastWeekData = []
        var billingData = []
        var yesterdayData = []
        
        monthData.forEach(element => {
            if (new Date(element.timestamp) <= yesterdayEnd && new Date(element.timestamp) >= yesterdayStart){
                yesterdayData.push(element)
            }
            if (new Date(element.timestamp) <= yesterday && new Date(element.timestamp) >= sevenDaysAgo){
                lastWeekData.push(element)
            } 
            if (new Date(element.timestamp) <= yesterday && new Date(element.timestamp) >= billingStart){
                billingData.push(element)
            } 
        })
        var todayEnergy = todayData.reduce((total, current) => total + current.tp_energy,0)
        // console.log("total Energy today: ", todayEnergy)
        todayEnergy = wattsToKWH(todayEnergy)

        var todayEstimatedEnergy = solcastData.reduce((total, current) => total + current.pv_estimate,0)
        // console.log("total Energy estimated today: ", todayEstimatedEnergy)
        todayEstimatedEnergy = wattsToKWH(todayEstimatedEnergy)

        var todaySpotRevenue = todayData.reduce((total, current) => total + current.tp_spot_revenue, 0)
        todaySpotRevenue = formatDollars(todaySpotRevenue)
        // console.log("total Spot Revenue today: ", todaySpotRevenue)

        var todayFixedRevenue = todayData.reduce((total, current) => total + current.tp_fixed_revenue, 0)
        todayFixedRevenue = formatDollars(todayFixedRevenue)
        // console.log("total Fixed Revenue today: ", todayFixedRevenue)
        
        var yesterdayEnergy = yesterdayData.reduce((total, current) => total + current.day_total_energy,0)
        yesterdayEnergy = wattsToKWH(yesterdayEnergy)
        // console.log("total Energy yesterday: ", yesterdayEnergy)
        
        var yesterdayEstimatedEnergy = yesterdayData.reduce((total, current) => total + current.day_total_estimated,0)
        yesterdayEstimatedEnergy = wattsToKWH(yesterdayEstimatedEnergy)
        // console.log("total Energy yesterday: ", yesterdayEstimatedEnergy)

        var yesterdaySpotRevenue = yesterdayData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        yesterdaySpotRevenue = formatDollars(yesterdaySpotRevenue)
        // console.log("total Spot Revenue yesterday: ", yesterdaySpotRevenue)

        var yesterdayFixedRevenue = yesterdayData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        yesterdayFixedRevenue = formatDollars(yesterdayFixedRevenue)
        // console.log("total Fixed Revenue yesterday: ", yesterdayFixedRevenue)
        
        var lastWeekEnergy = lastWeekData.reduce((total, current) => total + current.day_total_energy,0)
        lastWeekEnergy = wattsToKWH(lastWeekEnergy)
        // console.log("total Energy week: ", lastWeekEnergy)

        var lastWeekEstimatedEnergy = lastWeekData.reduce((total, current) => total + current.day_total_estimated,0)
        lastWeekEstimatedEnergy = wattsToKWH(lastWeekEstimatedEnergy)
        // console.log("total Energy week: ", lastWeekEstimatedEnergy)

        var lastWeekSpotRevenue = lastWeekData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        lastWeekSpotRevenue = formatDollars(lastWeekSpotRevenue)
        // console.log("total Spot Revenue week: ", lastWeekSpotRevenue)

        var lastWeekFixedRevenue = lastWeekData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        lastWeekFixedRevenue = formatDollars(lastWeekFixedRevenue)
        // console.log("total Fixed Revenue week: ", lastWeekFixedRevenue)
        
        var billingEnergy = billingData.reduce((total, current) => total + current.day_total_energy,0)
        billingEnergy = wattsToKWH(billingEnergy)
        // console.log("total Energy billing: ", billingEnergy)

        var billingEstimatedEnergy = billingData.reduce((total, current) => total + current.day_total_estimated,0)
        billingEstimatedEnergy = wattsToKWH(billingEstimatedEnergy)
        // console.log("total est Energy billing: ", billingEstimatedEnergy)

        var billingSpotRevenue = billingData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        billingSpotRevenue = formatDollars(billingSpotRevenue)
        // console.log("total Spot Revenue billing: ", billingSpotRevenue)

        var billingFixedRevenue = billingData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        billingFixedRevenue = formatDollars(billingFixedRevenue)
        // console.log("total Fixed Revenue billing: ", billingFixedRevenue)
    } 
    
    return(
        <div>     
            <CardGroup>
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Energy</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : todayEnergy}</li>
                            <li>Today (est): {isLoading? <Spinner animation="border" size="sm"/> : todayEstimatedEnergy}</li>
                            <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : yesterdayEnergy}</li>
                            <li>Yesterday (est): {isLoading? <Spinner animation="border" size="sm"/> : yesterdayEstimatedEnergy}</li> 
                            <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : lastWeekEnergy}</li>
                            <li>Previous 7 days (est): {isLoading? <Spinner animation="border" size="sm"/> : lastWeekEstimatedEnergy}</li>
                            <li>This billing period : {isLoading? <Spinner animation="border" size="sm"/> : billingEnergy}</li>
                            <li>This billing period (est): {isLoading? <Spinner animation="border" size="sm"/> : billingEstimatedEnergy}</li> 
                        </ul>
                    </Card.Body>
                </Card>
        
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Revenue: Spot Price</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : todaySpotRevenue}</li>
                            <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : yesterdaySpotRevenue}</li>
                            <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : lastWeekSpotRevenue}</li>
                            <li>This billing period (calendar month): {isLoading? <Spinner animation="border" size="sm"/> : billingSpotRevenue}</li>
                        </ul>
                    </Card.Body>
                </Card>
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Revenue: Fixed Price</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : todayFixedRevenue}</li>
                            <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : yesterdayFixedRevenue}</li>
                            <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : lastWeekFixedRevenue}</li>
                            <li>This billing period (calendar month): {isLoading? <Spinner animation="border" size="sm"/> : billingFixedRevenue}</li>
                        </ul>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    )
    
}

export default DashCard