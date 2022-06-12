
import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'

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

const DashCard = () => {
    const [dayData,setDayData] = useState()
    const [yesterdayData,setYesterdayData] = useState()
    const [weekData, setWeekData] = useState()
    const [billingData, setBillingData] = useState()
    const [isLoading,setIsLoading] = useState(true)
    const baseURL = 'https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/'
    const deviceID = 'x_inv_tp'
    var dt = new Date();
    var dtYesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
    var dtLastWeek = new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 7))
    var isoTimeYesterday = toIsoString(dtYesterday)
    var isoTimeNow = toIsoString(dt)
    var isoDateToday = isoTimeNow.slice(0,10)
    var isoTimeLastWeek = toIsoString(dtLastWeek)
    var isoStartBilling = isoDateToday.slice(0,7)
    var isoDateYesterday = isoTimeYesterday.slice(0,10)
    
    const weekQueryString = `${isoTimeLastWeek}/${isoTimeNow}`
    const dayQueryString = `${isoDateToday}`
    const billingQueryString = `${isoStartBilling}/${isoTimeNow}`
    const yesterdayQueryString = `${isoDateYesterday}`

    const fullWeekURL = `${baseURL}${deviceID}/${weekQueryString}`
    const fullDayURL = `${baseURL}${deviceID}/${dayQueryString}`
    const fullBillingURL = `${baseURL}${deviceID}/${billingQueryString}`
    const fullYesterdayURL = `${baseURL}${deviceID}/${yesterdayQueryString}`


    const fetchData = async() => {
        try {
            const dayResult = await fetch(fullDayURL)
            const dayJson = await dayResult.json()
            setDayData(dayJson)

            // console.log("yesterday URL", fullYesterdayURL)
            const yesterdayResult = await fetch(fullYesterdayURL)
            const yesterdayJson = await yesterdayResult.json()
            setYesterdayData(yesterdayJson)

            // console.log("week URL", fullWeekURL)
            const weekResult = await fetch(fullWeekURL)
            const weekJson = await weekResult.json()
            setWeekData(weekJson)

             console.log("billing URL", fullBillingURL)
            const billingResult = await fetch(fullBillingURL)
            const billingJson = await billingResult.json()
            setBillingData(billingJson)

        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    } 
    useEffect(() => {
        fetchData()
        const intervalId = setInterval(() => {
            console.log("updated DashCard!")
            fetchData()
        },600000)
        return () => clearInterval(intervalId)
    },[])
    
    if (! isLoading) {
        // console.log("day data",dayData.Items)
        // console.log("yesterday data",yesterdayData.Items)
        // console.log("billing data",billingData.Items)

        const rawDayData = dayData.Items
        
        const dayMapRevenue = rawDayData.map(x=>x.tp_revenue)
        const dayRevenue = totalAttribute(dayMapRevenue)
        const totalDayRevenue = `$${dayRevenue.toFixed(2)}`

        const dayMapEnergy = rawDayData.map(x => x.tp_energy)
        const dayEnergy = totalAttribute(dayMapEnergy)
        const totalDayEnergy = `${dayEnergy/1000} kWh`

        const rawYesterdayData = yesterdayData.Items

        const yesterdayMapRevenue = rawYesterdayData.map(x=>x.tp_revenue)
        const yesterdayRevenue = totalAttribute(yesterdayMapRevenue)
        const totalYesterdayRevenue = `$${yesterdayRevenue.toFixed(2)}`

        const yesterdayMapEnergy = rawYesterdayData.map(x => x.tp_energy)
        const yesterdayEnergy = totalAttribute(yesterdayMapEnergy)
        const totalYesterdayEnergy = `${yesterdayEnergy/1000} kWh`

        const rawWeekData = weekData.Items

        const weekMapRevenue = rawWeekData.map(x=>x.tp_revenue)
        const weekRevenue = totalAttribute(weekMapRevenue)
        const totalWeekRevenue = `$${weekRevenue.toFixed(2)}`

        const weekMapEnergy = rawWeekData.map(x => x.tp_energy)
        const weekEnergy = totalAttribute(weekMapEnergy)
        const totalWeekEnergy = `${weekEnergy/1000} kWh`

        const rawBillingData = billingData.Items

        const billingMapRevenue = rawBillingData.map(x=>x.tp_revenue)
        const billingRevenue = totalAttribute(billingMapRevenue)
        const totalBillingRevenue = `$${billingRevenue.toFixed(2)}`

        const billingMapEnergy = rawBillingData.map(x => x.tp_energy)
        const billingEnergy = totalAttribute(billingMapEnergy)
        const totalBillingEnergy = `${billingEnergy/1000} kWh`


    return(
        <div>     
            <CardGroup>
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Energy</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {totalDayEnergy}</li>
                            <li>Yesterday: {totalYesterdayEnergy}</li>
                            <li>Last 7 days: {totalWeekEnergy}</li>
                            <li>This billing period (calendar month): {totalBillingEnergy}</li>
                        </ul>
                    </Card.Body>
                </Card>
        
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Revenue:</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {totalDayRevenue}</li>
                            <li>Yesterday: {totalYesterdayRevenue}</li>
                            <li>Last 7 days: {totalWeekRevenue}</li>
                            <li>This billing period (calendar month): {totalBillingRevenue}</li>
                        </ul>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    )
    }
}

export default DashCard