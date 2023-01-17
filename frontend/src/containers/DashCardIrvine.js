import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Spinner from 'react-bootstrap/Spinner'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Accordion from 'react-bootstrap/Accordion'

const siteName = "irvine"
const fixedPanelMax = 17.6
const trackedPanelMax = 10.56

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

const formatPer = (trackedVal, fixedVal) => {
    var percent = ((trackedVal/trackedPanelMax)/(fixedVal/fixedPanelMax))*100 - 100
    percent = percent.toFixed(0)
    if (percent < 0){
        var colour = 'red'
    } else if (percent >= 0){
        var colour = 'green'
    } else {
        var colour = 'blue'
    }
    
    
    return <span style={{color: colour}}> ({percent}%) </span>
}

const DashCardIrvine = () => {
    const [trackedTodayData, setTrackedTodayData] = useState()
    const [fixedTodayData, setFixedTodayData] = useState()
    const [trackedSolcastData, setTrackedSolcastData] = useState()
    const [fixedSolcastData, setFixedSolcastData] = useState()
    const [isLoading,setIsLoading] = useState(true)
    const [trackedMonthData, setTrackedMonthData] = useState()
    const [fixedMonthData, setFixedMonthData] = useState()
    const baseURL = 'https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/'
    const trackedTodayDeviceID = `${siteName}_tracked_tp`
    const trackedDayDeviceID = `${siteName}_tracked_day`
    const trackedSolcastDeviceID = `${siteName}_tracked_solcast`
    
    const fixedTodayDeviceID = `${siteName}_fixed_tp`
    const fixedDayDeviceID = `${siteName}_fixed_day`
    const fixedSolcastDeviceID = `${siteName}_fixed_solcast`

    const fixedPanelMax = 17.6
    const trackedPanelMax = 10.56
    
    const fetchData = async() => {
        var isoTimeNow = getIsoTimeNow()
        var isoDateToday = isoTimeNow.slice(0,10)
        var isoDateMonthAgo = getIsoDateMinusDays(31)

        const todayQueryString = `${isoDateToday}`
        const monthQueryString = `${isoDateMonthAgo}/${isoDateToday}`

        const fullTrackedSolcastURL = `${baseURL}${trackedSolcastDeviceID}/${isoDateToday}`
        const fullFixedSolcastURL = `${baseURL}${fixedSolcastDeviceID}/${isoDateToday}`
        const fullTrackedMonthURL = `${baseURL}${trackedDayDeviceID}/${monthQueryString}`
        const fullFixedMonthURL = `${baseURL}${fixedDayDeviceID}/${monthQueryString}`
        const fullTrackedTodayURL = `${baseURL}${trackedTodayDeviceID}/${todayQueryString}`
        const fullFixedTodayURL = `${baseURL}${fixedTodayDeviceID}/${todayQueryString}`

        try {
            const trackedMonthResult = await axios.get(fullTrackedMonthURL)
            const trackedMonthData = trackedMonthResult.data.Items
            setTrackedMonthData(trackedMonthData)
            // console.log("month data: ", monthData)

            const fixedMonthResult = await axios.get(fullFixedMonthURL)
            const fixedMonthData = fixedMonthResult.data.Items
            setFixedMonthData(fixedMonthData)
            console.log("fixed month data: ", fixedMonthData)

            const trackedTodayResult = await axios.get(fullTrackedTodayURL)
            const trackedTodayData = trackedTodayResult.data.Items
            setTrackedTodayData(trackedTodayData)
            // console.log("today data: ", todayData)

            const fixedTodayResult = await axios.get(fullFixedTodayURL)
            const fixedTodayData = fixedTodayResult.data.Items
            setFixedTodayData(fixedTodayData)
            console.log("fixed today data: ", fixedTodayData)

            const trackedSolcastResult = await axios.get(fullTrackedSolcastURL)
            const trackedSolcastData = trackedSolcastResult.data.Items
            setTrackedSolcastData(trackedSolcastData)
            // console.log("solcast data: ", solcastData)

            const fixedSolcastResult = await axios.get(fullFixedSolcastURL)
            const fixedSolcastData = fixedSolcastResult.data.Items
            setFixedSolcastData(fixedSolcastData)

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
        var trackedLastWeekData = []
        var trackedBillingData = []
        var trackedYesterdayData = []
        
        var fixedLastWeekData = []
        var fixedBillingData = []
        var fixedYesterdayData = []
        
        trackedMonthData.forEach(element => {
            if (new Date(element.timestamp) <= yesterdayEnd && new Date(element.timestamp) >= yesterdayStart){
                trackedYesterdayData.push(element)
            }
            if (new Date(element.timestamp) <= yesterday && new Date(element.timestamp) >= sevenDaysAgo){
                trackedLastWeekData.push(element)
            } 
            if (new Date(element.timestamp) <= yesterday && new Date(element.timestamp) >= billingStart){
                trackedBillingData.push(element)
            } 
        })

        fixedMonthData.forEach(element => {
            if (new Date(element.timestamp) <= yesterdayEnd && new Date(element.timestamp) >= yesterdayStart){
                fixedYesterdayData.push(element)
            }
            if (new Date(element.timestamp) <= yesterday && new Date(element.timestamp) >= sevenDaysAgo){
                fixedLastWeekData.push(element)
            } 
            if (new Date(element.timestamp) <= yesterday && new Date(element.timestamp) >= billingStart){
                fixedBillingData.push(element)
            } 
        })
        // console.log("today data", todayData.slice(-1)[0].energy_day)
        var trackedTodayEnergy = trackedTodayData.slice(-1)[0].energy_day
        // trackedTodayEnergy = wattsToKWH(trackedTodayEnergy)
        console.log("total Tracked Energy today: ", trackedTodayEnergy)

        var fixedTodayEnergy = fixedTodayData.slice(-1)[0].energy_day
        // fixedTodayEnergy = wattsToKWH(fixedTodayEnergy)
        console.log("total Fixed Energy today: ", fixedTodayEnergy)

        var trackedTodayEstimatedEnergy = trackedSolcastData.reduce((total, current) => total + current.pv_estimate,0)
        // console.log("total Energy estimated today: ", todayEstimatedEnergy)
        // trackedTodayEstimatedEnergy = wattsToKWH(trackedTodayEstimatedEnergy)

        var fixedTodayEstimatedEnergy = fixedSolcastData.reduce((total, current) => total + current.pv_estimate,0)
        // console.log("total Energy estimated today: ", todayEstimatedEnergy)
        // fixedTodayEstimatedEnergy = wattsToKWH(fixedTodayEstimatedEnergy)

        var trackedTodaySpotRevenue = trackedTodayData.reduce((total, current) => total + current.tp_spot_revenue, 0)
        // trackedTodaySpotRevenue = formatDollars(trackedTodaySpotRevenue)
        // console.log("total Tracked Spot Revenue today: ", trackedTodaySpotRevenue)

        var fixedTodaySpotRevenue = fixedTodayData.reduce((total, current) => total + current.tp_spot_revenue, 0)
        // fixedTodaySpotRevenue = formatDollars(fixedTodaySpotRevenue)
        console.log("total Fixed Spot Revenue today: ", fixedTodaySpotRevenue)

        var trackedTodayFixedRevenue = trackedTodayData.reduce((total, current) => total + current.tp_fixed_revenue, 0)
        // trackedTodayFixedRevenue = formatDollars(trackedTodayFixedRevenue)
        // console.log("total Tracked Fixed Revenue today: ", trackedTodayFixedRevenue)

        var fixedTodayFixedRevenue = fixedTodayData.reduce((total, current) => total + current.tp_fixed_revenue, 0)
        // fixedTodayFixedRevenue = formatDollars(fixedTodayFixedRevenue)
        // console.log("total Fixed Fixed Revenue today: ", fixed TodayFixedRevenue)
        
        var trackedYesterdayEnergy = trackedYesterdayData.reduce((total, current) => total + current.day_total_energy,0)
        // trackedYesterdayEnergy = wattsToKWH(trackedYesterdayEnergy)
        // console.log("total Tracked Energy yesterday: ", yesterdayEnergy)
        
        var fixedYesterdayEnergy = fixedYesterdayData.reduce((total, current) => total + current.day_total_energy,0)
        // fixedYesterdayEnergy = wattsToKWH(fixedYesterdayEnergy)
        // console.log("total Fixed Energy yesterday: ", fixedYesterdayEnergy)

        var trackedYesterdayEstimatedEnergy = trackedYesterdayData.reduce((total, current) => total + current.day_total_estimated,0)
        // trackedYesterdayEstimatedEnergy = wattsToKWH(trackedYesterdayEstimatedEnergy)
        // console.log("total Tracked Energy yesterday: ", trackedYesterdayEstimatedEnergy)

        var fixedYesterdayEstimatedEnergy = fixedYesterdayData.reduce((total, current) => total + current.day_total_estimated,0)
        // fixedYesterdayEstimatedEnergy = wattsToKWH(fixedYesterdayEstimatedEnergy)
        // console.log("total Tracked Energy yesterday: ", trackedYesterdayEstimatedEnergy)

        var trackedYesterdaySpotRevenue = trackedYesterdayData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        // trackedYesterdaySpotRevenue = formatDollars(trackedYesterdaySpotRevenue)
        // console.log("total Tracked Spot Revenue yesterday: ", trackedYesterdaySpotRevenue)

        var fixedYesterdaySpotRevenue = fixedYesterdayData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        // fixedYesterdaySpotRevenue = formatDollars(fixedYesterdaySpotRevenue)
        // console.log("total Fixed Spot Revenue yesterday: ", fixedYesterdaySpotRevenue)

        var trackedYesterdayFixedRevenue = trackedYesterdayData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        // trackedYesterdayFixedRevenue = formatDollars(trackedYesterdayFixedRevenue)
        // console.log("total Tracked Fixed Revenue yesterday: ", trackedYesterdayFixedRevenue)

        var fixedYesterdayFixedRevenue = fixedYesterdayData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        // fixedYesterdayFixedRevenue = formatDollars(fixedYesterdayFixedRevenue)
        // console.log("total Fixed Fixed Revenue yesterday: ", fixedYesterdayFixedRevenue)
        
        var trackedLastWeekEnergy = trackedLastWeekData.reduce((total, current) => total + current.day_total_energy,0)
        trackedLastWeekEnergy = trackedLastWeekEnergy ? trackedLastWeekEnergy : 0
        // trackedLastWeekEnergy = wattsToKWH(trackedLastWeekEnergy)
        // console.log("total Tracked Energy week: ", trackedLastWeekEnergy)

        var fixedLastWeekEnergy = fixedLastWeekData.reduce((total, current) => total + current.day_total_energy,0)
        fixedLastWeekEnergy = fixedLastWeekEnergy ? fixedLastWeekEnergy : 0
        // fixedLastWeekEnergy = wattsToKWH(fixedLastWeekEnergy)
        // console.log("total Fixed Energy week: ", fixedLastWeekEnergy)
        

        var trackedLastWeekEstimatedEnergy = trackedLastWeekData.reduce((total, current) => total + current.day_total_estimated,0)
        // trackedLastWeekEstimatedEnergy = wattsToKWH(trackedLastWeekEstimatedEnergy)
        // console.log("total Tracked Energy week: ", trackedLastWeekEstimatedEnergy)

        var fixedLastWeekEstimatedEnergy = fixedLastWeekData.reduce((total, current) => total + current.day_total_estimated,0)
        // fixedLastWeekEstimatedEnergy = wattsToKWH(fixedLastWeekEstimatedEnergy)
        // console.log("total Fixed Energy week: ", fixedLastWeekEstimatedEnergy)

        var trackedLastWeekSpotRevenue = trackedLastWeekData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        // trackedLastWeekSpotRevenue = formatDollars(trackedLastWeekSpotRevenue)
        // console.log("total Tracked Spot Revenue week: ", trackedLastWeekSpotRevenue)

        var fixedLastWeekSpotRevenue = fixedLastWeekData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        // fixedLastWeekSpotRevenue = formatDollars(fixedLastWeekSpotRevenue)
        // console.log("total Fixed Spot Revenue week: ", fixedLastWeekSpotRevenue)

        var trackedLastWeekFixedRevenue = trackedLastWeekData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        // trackedLastWeekFixedRevenue = formatDollars(trackedLastWeekFixedRevenue)
        // console.log("total Tracked Fixed Revenue week: ", trackedLastWeekFixedRevenue)

        var fixedLastWeekFixedRevenue = fixedLastWeekData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        // fixedLastWeekFixedRevenue = formatDollars(fixedLastWeekFixedRevenue)
        // console.log("total Fixed Fixed Revenue week: ", fixedLastWeekFixedRevenue)
        
        var trackedBillingEnergy = trackedBillingData.reduce((total, current) => total + current.day_total_energy,0)
        // trackedBillingEnergy = wattsToKWH(trackedBillingEnergy)
        // console.log("total Tracked Energy billing: ", trackedBillingEnergy)

        var fixedBillingEnergy = fixedBillingData.reduce((total, current) => total + current.day_total_energy,0)
        // fixedBillingEnergy = wattsToKWH(fixedBillingEnergy)
        // console.log("total Fixed Energy billing: ", fixedBillingEnergy)

        var trackedBillingEstimatedEnergy = trackedBillingData.reduce((total, current) => total + current.day_total_estimated,0)
        // trackedBillingEstimatedEnergy = wattsToKWH(trackedBillingEstimatedEnergy)
        // console.log("total est Tracked Energy billing: ", trackedBillingEstimatedEnergy)

        var fixedBillingEstimatedEnergy = fixedBillingData.reduce((total, current) => total + current.day_total_estimated,0)
        // fixedBillingEstimatedEnergy = wattsToKWH(fixedBillingEstimatedEnergy)
        // console.log("total est Fixed Energy billing: ", fixedBillingEstimatedEnergy)

        var trackedBillingSpotRevenue = trackedBillingData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        // trackedBillingSpotRevenue = formatDollars(trackedBillingSpotRevenue)
        // console.log("total tracked Spot Revenue billing: ", trackedBillingSpotRevenue)

        var fixedBillingSpotRevenue = fixedBillingData.reduce((total, current) => total + current.day_total_spot_revenue, 0)
        // fixedBillingSpotRevenue = formatDollars(fixedBillingSpotRevenue)
        // console.log("total fixed Spot Revenue billing: ", fixedBillingSpotRevenue)

        var trackedBillingFixedRevenue = trackedBillingData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        // trackedBillingFixedRevenue = formatDollars(trackedBillingFixedRevenue)
        // console.log("total tracked Fixed Revenue billing: ", trackedBillingFixedRevenue)

        var fixedBillingFixedRevenue = fixedBillingData.reduce((total, current) => total + current.day_total_fixed_revenue, 0)
        // fixedBillingFixedRevenue = formatDollars(fixedBillingFixedRevenue)
        // console.log("total fixed Fixed Revenue billing: ", fixedBillingFixedRevenue)

        // var trackedEnergyTodayPer = ((trackedTodayEnergy/trackedPanelMax)/(fixedTodayEnergy/fixedPanelMax)-1).toFixed(0)
        // if (trackedEnergyTodayPer < 0){
        //     trackedEnergyTodayColour = 'red'
        // } else { 
        //     trackedEnergyTodayColour = 'green'
        // }
    }  
    
    return(
        <div>     
            <CardGroup>
            <Card className='mb-3 mt-3'>
                <Card.Title className='mt-2'>&nbsp;Total Energy</Card.Title>
                <Card.Body>
                    <ul>
                        <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : `${wattsToKWH(trackedTodayEnergy + fixedTodayEnergy)}`}</li>
                        <li>Today (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedTodayEstimatedEnergy + fixedTodayEstimatedEnergy)}</li>
                        <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedYesterdayEnergy + fixedYesterdayEnergy)}</li>
                        <li>Yesterday (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedYesterdayEstimatedEnergy + fixedYesterdayEstimatedEnergy)}</li> 
                        <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedLastWeekEnergy + fixedLastWeekEnergy)}</li>
                        <li>Previous 7 days (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedLastWeekEstimatedEnergy + fixedLastWeekEstimatedEnergy)}</li>
                        <li>This calendar month : {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedBillingEnergy + fixedBillingEnergy)}</li>
                        <li>This calendar month (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedBillingEstimatedEnergy + fixedBillingEstimatedEnergy)}</li> 
                    </ul>
                </Card.Body>
                <Card.Footer className='bg-transparent border-0'>
                    <Accordion alwaysOpen>
                        <Accordion.Item eventKey='0'>
                            <Accordion.Header>Tracked</Accordion.Header>
                            <Accordion.Body>
                            <ul>
                                <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedTodayEnergy)}{formatPer(trackedTodayEnergy, fixedTodayEnergy)}</li>
                                {/* <li>Today (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedTodayEstimatedEnergy)}</li> */}
                                <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedYesterdayEnergy)}{formatPer(trackedYesterdayEnergy, fixedYesterdayEnergy)}</li>
                                {/* <li>Yesterday (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedYesterdayEstimatedEnergy)}</li>  */}
                                <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedLastWeekEnergy)}{formatPer(trackedLastWeekEnergy, fixedLastWeekEnergy)}</li>
                                {/* <li>Previous 7 days (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedLastWeekEstimatedEnergy)}</li> */}
                                <li>This calendar month : {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedBillingEnergy)}{formatPer(trackedBillingEnergy, fixedBillingEnergy)}</li>
                                {/* <li>This calendar month (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(trackedBillingEstimatedEnergy)}</li>  */}
                            </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey='1'>
                            <Accordion.Header>Fixed</Accordion.Header>
                            <Accordion.Body>
                            <ul>
                                <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(fixedTodayEnergy)}</li>
                                {/* <li>Today (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(fixedTodayEstimatedEnergy)}</li> */}
                                <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(fixedYesterdayEnergy)}</li>
                                {/* <li>Yesterday (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(fixedYesterdayEstimatedEnergy)}</li>  */}
                                <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(fixedLastWeekEnergy)}</li>
                                {/* <li>Previous 7 days (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(fixedLastWeekEstimatedEnergy)}</li> */}
                                <li>This calendar month : {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(fixedBillingEnergy)}</li>
                                {/* <li>This calendar month (est): {isLoading? <Spinner animation="border" size="sm"/> : wattsToKWH(fixedBillingEstimatedEnergy)}</li>  */}
                            </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Footer>
            </Card>
    
            <Card className='mb-3 mt-3'>
                <Card.Title className='mt-2'>&nbsp;Total Revenue: Spot Price</Card.Title>
                <Card.Body>
                    <ul>
                        <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedTodaySpotRevenue + fixedTodaySpotRevenue)}</li>
                        <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedYesterdaySpotRevenue + fixedYesterdaySpotRevenue)}</li>
                        <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedLastWeekSpotRevenue + fixedLastWeekSpotRevenue)}</li>
                        <li>This calendar month: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedBillingSpotRevenue + fixedBillingSpotRevenue)}</li>
                    </ul>
                </Card.Body>
                <Card.Footer className='bg-transparent border-0'>
                    <Accordion alwaysOpen>
                        <Accordion.Item eventKey='0'>
                            <Accordion.Header>Tracked</Accordion.Header>
                            <Accordion.Body>
                            <ul>
                                <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedTodaySpotRevenue)}{formatPer(trackedTodaySpotRevenue, fixedTodaySpotRevenue)}</li>
                                <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedYesterdaySpotRevenue)}{formatPer(trackedYesterdaySpotRevenue, fixedYesterdaySpotRevenue)}</li>
                                <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedLastWeekSpotRevenue)}{formatPer(trackedLastWeekSpotRevenue, fixedLastWeekSpotRevenue)}</li>
                                <li>This calendar month: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedBillingSpotRevenue)}{formatPer(trackedBillingSpotRevenue, fixedBillingSpotRevenue)}</li>
                            </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey='1'>
                            <Accordion.Header>Fixed</Accordion.Header>
                            <Accordion.Body>
                            <ul>
                                <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(fixedTodaySpotRevenue)}</li>
                                <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(fixedYesterdaySpotRevenue)}</li>
                                <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(fixedLastWeekSpotRevenue)}</li>
                                <li>This calendar month: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(fixedBillingSpotRevenue)}</li>
                            </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Footer>
            </Card>
            <Card className='mb-3 mt-3'>
                <Card.Title className='mt-2'>&nbsp;Total Revenue: Fixed Price</Card.Title>
                <Card.Body>
                    <ul>
                        <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedTodayFixedRevenue + fixedTodayFixedRevenue)}</li>
                        <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedYesterdayFixedRevenue + fixedYesterdayFixedRevenue)}</li>
                        <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedLastWeekFixedRevenue + fixedLastWeekFixedRevenue)}</li>
                        <li>This calendar month: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedBillingFixedRevenue + fixedBillingFixedRevenue)}</li>
                    </ul>
                </Card.Body>
                    <Card.Footer className='bg-transparent border-0'>
                        <Accordion alwaysOpen>
                        <Accordion.Item eventKey='0'>
                            <Accordion.Header>Tracked</Accordion.Header>
                            <Accordion.Body>
                            <ul>
                                <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedTodayFixedRevenue)}{formatPer(trackedTodayFixedRevenue, fixedTodayFixedRevenue)}</li>
                                <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedYesterdayFixedRevenue)}{formatPer(trackedYesterdayFixedRevenue, fixedYesterdayFixedRevenue)}</li>
                                <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedLastWeekFixedRevenue)}{formatPer(trackedLastWeekFixedRevenue, fixedLastWeekFixedRevenue)}</li>
                                <li>This calendar month: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(trackedBillingFixedRevenue)}{formatPer(trackedBillingFixedRevenue, fixedBillingFixedRevenue)}</li>
                            </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey='1'>
                            <Accordion.Header>Fixed</Accordion.Header>
                            <Accordion.Body>
                            <ul>
                                <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(fixedTodayFixedRevenue)}</li>
                                <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(fixedYesterdayFixedRevenue)}</li>
                                <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(fixedLastWeekFixedRevenue)}</li>
                                <li>This calendar month: {isLoading? <Spinner animation="border" size="sm"/> : formatDollars(fixedBillingFixedRevenue)}</li>
                            </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        </Accordion>
                        </Card.Footer>
                
            </Card>
        </CardGroup>    
    </div>
    )
    
}

export default DashCardIrvine