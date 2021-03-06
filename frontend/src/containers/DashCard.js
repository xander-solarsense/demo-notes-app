
import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Spinner from 'react-bootstrap/Spinner'

const totalAttribute = (attribute) => {
    var total = 0
    for (var i = 0; i < attribute.length; i++) {
        total += attribute[i]
    }
    return total
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

const getIsoDateYesterday = () => {
var dtYesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
var isoTimeYesterday = toIsoString(dtYesterday)
var isoDateYesterday = isoTimeYesterday.slice(0,10)

return isoDateYesterday
}

const getIsoTimeNow = () => {
    var dt = new Date();
    var isoTime = toIsoString(dt);

    return isoTime
}

const getIsoDateLastWeek = () => {
    var dtLastWeek = new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 7))
    var isoTimeLastWeek = toIsoString(dtLastWeek)
    var isoDateLastWeek = isoTimeLastWeek.slice(0,10)

    return isoDateLastWeek
 }


const DashCard = () => {
    const [todayData,setTodayData] = useState()
    const [yesterdayData,setYesterdayData] = useState()
    const [weekData, setWeekData] = useState()
    const [billingData, setBillingData] = useState()
    const [isLoading,setIsLoading] = useState(true)
    const baseURL = 'https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/'
    const deviceID = 'x_inv_tp'
    
    const fetchData = async() => {
        var isoTimeNow = getIsoTimeNow()
        var isoDateToday = isoTimeNow.slice(0,10)
        var isoStartBilling = isoDateToday.slice(0,7)
        var isoDateYesterday = getIsoDateYesterday()
        var isoDateLastWeek = getIsoDateLastWeek()

        const weekQueryString = `${isoDateLastWeek}/${isoDateYesterday}`
        const todayQueryString = `${isoDateToday}`
        const billingQueryString = `${isoStartBilling}/${isoTimeNow}`
        const yesterdayQueryString = `${isoDateYesterday}`

        const fullWeekURL = `${baseURL}${deviceID}/${weekQueryString}`
        const fullDayURL = `${baseURL}${deviceID}/${todayQueryString}`
        const fullBillingURL = `${baseURL}${deviceID}/${billingQueryString}`
        const fullYesterdayURL = `${baseURL}${deviceID}/${yesterdayQueryString}`

        try {
            const todayResult = await fetch(fullDayURL)
            const todayJson = await todayResult.json()
            setTodayData(todayJson)

            // console.log("yesterday URL", fullYesterdayURL)
            const yesterdayResult = await fetch(fullYesterdayURL)
            const yesterdayJson = await yesterdayResult.json()
            setYesterdayData(yesterdayJson)

            // console.log("week URL", fullWeekURL)
            const weekResult = await fetch(fullWeekURL)
            const weekJson = await weekResult.json()
            setWeekData(weekJson)

            //  console.log("billing URL", fullBillingURL)
        
            const billingResult = await fetch(fullBillingURL)
            const billingJson = await billingResult.json()
            setBillingData(billingJson)

            console.log(`updated DashCard at ${isoTimeNow}`)

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
        // console.log("day data",dayData.Items)
        // console.log("yesterday data",yesterdayData.Items)
        // console.log("billing data",billingData.Items)

        const rawTodayData = todayData.Items
        
        const todayMapRevenue = rawTodayData.map(x=>x.tp_revenue)
        const todayRevenue = totalAttribute(todayMapRevenue)
        var totalTodayRevenue = `$${todayRevenue.toFixed(2)}`

        const todayMapEnergy = rawTodayData.map(x => x.tp_energy)
        const todayEnergy = totalAttribute(todayMapEnergy)
        var totalTodayEnergy = `${todayEnergy/1000} kWh`

        const rawYesterdayData = yesterdayData.Items

        const yesterdayMapRevenue = rawYesterdayData.map(x=>x.tp_revenue)
        const yesterdayRevenue = totalAttribute(yesterdayMapRevenue)
        var totalYesterdayRevenue = `$${yesterdayRevenue.toFixed(2)}`

        const yesterdayMapEnergy = rawYesterdayData.map(x => x.tp_energy)
        const yesterdayEnergy = totalAttribute(yesterdayMapEnergy)
        var totalYesterdayEnergy = `${yesterdayEnergy/1000} kWh`

        const rawWeekData = weekData.Items

        const weekMapRevenue = rawWeekData.map(x=>x.tp_revenue)
        const weekRevenue = totalAttribute(weekMapRevenue)
        var totalWeekRevenue = `$${weekRevenue.toFixed(2)}`

        const weekMapEnergy = rawWeekData.map(x => x.tp_energy)
        const weekEnergy = totalAttribute(weekMapEnergy)
        var totalWeekEnergy = `${weekEnergy/1000} kWh`

        const rawBillingData = billingData.Items

        const billingMapRevenue = rawBillingData.map(x=>x.tp_revenue)
        const billingRevenue = totalAttribute(billingMapRevenue)
        var totalBillingRevenue = `$${billingRevenue.toFixed(2)}`

        const billingMapEnergy = rawBillingData.map(x => x.tp_energy)
        const billingEnergy = totalAttribute(billingMapEnergy)
        var totalBillingEnergy = `${billingEnergy/1000} kWh`

    } 
    
    return(
        <div>     
            <CardGroup>
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Energy</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : totalTodayEnergy}</li>
                            <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : totalYesterdayEnergy}</li>
                            <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : totalWeekEnergy}</li>
                            <li>This billing period (calendar month): {isLoading? <Spinner animation="border" size="sm"/> : totalBillingEnergy}</li>
                        </ul>
                    </Card.Body>
                </Card>
        
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Revenue</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : totalTodayRevenue}</li>
                            <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : totalYesterdayRevenue}</li>
                            <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : totalWeekRevenue}</li>
                            <li>This billing period (calendar month): {isLoading? <Spinner animation="border" size="sm"/> : totalBillingRevenue}</li>
                        </ul>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    )
    
}

export default DashCard