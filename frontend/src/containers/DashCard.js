
import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Spinner from 'react-bootstrap/Spinner'

const siteName = "te_anga"

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
    const [todayEnergyData, setTodayEnergyData] = useState()
    const [yesterdayData,setYesterdayData] = useState()
    const [yesterdayEnergyData,setYesterdayEnergyData] = useState()
    const [weekData, setWeekData] = useState()
    const [billingData, setBillingData] = useState()
    const [todaySolcastData, setTodaySolcastData] = useState()
    const [isLoading,setIsLoading] = useState(true)
    const baseURL = 'https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/'
    const deviceID = `${siteName}_tp`
    const solcastDeviceID = `${siteName}_solcast`
    
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
        const fullDayEnergyURL = `${baseURL}${siteName}_2s/${todayQueryString}/limit/1`
        const fullBillingURL = `${baseURL}${deviceID}/${billingQueryString}`
        const fullYesterdayURL = `${baseURL}${deviceID}/${yesterdayQueryString}`
        const fullYesterdayEnergyURL = `${baseURL}${siteName}_1/${yesterdayQueryString}/limit/1`
        const fullTodaySolcastURL = `${baseURL}${solcastDeviceID}/${isoDateToday}`

        try {
            const todayResult = await fetch(fullDayURL)
            const todayJson = await todayResult.json()
            setTodayData(todayJson)

            // console.log("today energy URL", fullDayEnergyURL)
            const todayEnergyResult = await fetch(fullDayEnergyURL)
            const todayEnergyJson = await todayEnergyResult.json()
            console.log("today energy result", todayEnergyJson)
            setTodayEnergyData(todayEnergyJson)

            const todaySolcastResult = await fetch(fullTodaySolcastURL)
            const todaySolcastJson = await todaySolcastResult.json()
            setTodaySolcastData(todaySolcastJson)

            // console.log("yesterday URL", fullYesterdayURL)
            const yesterdayResult = await fetch(fullYesterdayURL)
            const yesterdayJson = await yesterdayResult.json()
            setYesterdayData(yesterdayJson)

            // console.log("today energy URL", fullDayEnergyURL)
            const yesterdayEnergyResult = await fetch(fullYesterdayEnergyURL)
            const yesterdayEnergyJson = await yesterdayEnergyResult.json()
            // console.log("today energy result", todayEnergyJson)
            setYesterdayEnergyData(yesterdayEnergyJson)

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
        const rawTodayEnergyData = todayEnergyData.Items
        const rawTodaySolcastData = todaySolcastData.Items
        // console.log("today raw: ", rawTodayEnergyData)
        
        const todaySpotMapRevenue = rawTodayData.map(x=>x.tp_spot_revenue)
        const todaySpotRevenue = totalAttribute(todaySpotMapRevenue)
        var totalTodaySpotRevenue = `$${todaySpotRevenue.toFixed(2)}`

        const todayFixedMapRevenue = rawTodayData.map(x=>x.tp_fixed_revenue)
        const todayFixedRevenue = totalAttribute(todayFixedMapRevenue)
        var totalTodayFixedRevenue = `$${todayFixedRevenue.toFixed(2)}`

        const todayEnergy = rawTodayEnergyData[0].day_energy
        // console.log("today energy", todayEnergy)
        var totalTodayEnergy = `${todayEnergy/1000} kWh`
        // console.log("today energy for card", totalTodayEnergy)

        const todaySolcastMapData = rawTodaySolcastData.map(x=>x.pv_estimate)
        const todaySolcast = totalAttribute(todaySolcastMapData)
        var totalTodaySolcast = `${todaySolcast/1000} kWh`

        const rawYesterdayData = yesterdayData.Items
        const rawYesterdayEnergyData = yesterdayEnergyData.Items

        const yesterdaySpotMapRevenue = rawYesterdayData.map(x=>x.tp_spot_revenue)
        const yesterdaySpotRevenue = totalAttribute(yesterdaySpotMapRevenue)
        var totalYesterdaySpotRevenue = `$${yesterdaySpotRevenue.toFixed(2)}`

        const yesterdayFixedMapRevenue = rawYesterdayData.map(x=>x.tp_fixed_revenue)
        const yesterdayFixedRevenue = totalAttribute(yesterdayFixedMapRevenue)
        var totalYesterdayFixedRevenue = `$${yesterdayFixedRevenue.toFixed(2)}`

        const yesterdayEnergy = rawYesterdayEnergyData[0].te_anga_energy
        
        var totalYesterdayEnergy = `${yesterdayEnergy/1000} kWh`

        const rawWeekData = weekData.Items

        const weekSpotMapRevenue = rawWeekData.map(x=>x.tp_spot_revenue)
        const weekSpotRevenue = totalAttribute(weekSpotMapRevenue)
        var totalWeekSpotRevenue = `$${weekSpotRevenue.toFixed(2)}`

        const weekFixedMapRevenue = rawWeekData.map(x=>x.tp_fixed_revenue)
        const weekFixedRevenue = totalAttribute(weekFixedMapRevenue)
        var totalWeekFixedRevenue = `$${weekFixedRevenue.toFixed(2)}`

        const weekMapEnergy = rawWeekData.map(x => x.tp_energy)
        const weekEnergy = totalAttribute(weekMapEnergy)
        var totalWeekEnergy = `${weekEnergy/1000} kWh`

        const rawBillingData = billingData.Items

        const billingSpotMapRevenue = rawBillingData.map(x=>x.tp_spot_revenue)
        const billingSpotRevenue = totalAttribute(billingSpotMapRevenue)
        var totalBillingSpotRevenue = `$${billingSpotRevenue.toFixed(2)}`

        const billingFixedMapRevenue = rawBillingData.map(x=>x.tp_fixed_revenue)
        const billingFixedRevenue = totalAttribute(billingFixedMapRevenue)
        var totalBillingFixedRevenue = `$${billingFixedRevenue.toFixed(2)}`

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
                            <li>Today Total Estimated: {isLoading? <Spinner animation="border" size="sm"/> : totalTodaySolcast}</li>
                            <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : totalYesterdayEnergy}</li>
                            <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : totalWeekEnergy}</li>
                            <li>This billing period (calendar month): {isLoading? <Spinner animation="border" size="sm"/> : totalBillingEnergy}</li>
                        </ul>
                    </Card.Body>
                </Card>
        
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Revenue: Spot Price</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : totalTodaySpotRevenue}</li>
                            <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : totalYesterdaySpotRevenue}</li>
                            <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : totalWeekSpotRevenue}</li>
                            <li>This billing period (calendar month): {isLoading? <Spinner animation="border" size="sm"/> : totalBillingSpotRevenue}</li>
                        </ul>
                    </Card.Body>
                </Card>
                <Card className='mb-3 mt-3'>
                    <Card.Title className='mt-2'>&nbsp;Total Revenue: Fixed Price</Card.Title>
                    <Card.Body>
                        <ul>
                            <li>Today: {isLoading? <Spinner animation="border" size="sm"/> : totalTodayFixedRevenue}</li>
                            <li>Yesterday: {isLoading? <Spinner animation="border" size="sm"/> : totalYesterdayFixedRevenue}</li>
                            <li>Previous 7 days: {isLoading? <Spinner animation="border" size="sm"/> : totalWeekFixedRevenue}</li>
                            <li>This billing period (calendar month): {isLoading? <Spinner animation="border" size="sm"/> : totalBillingFixedRevenue}</li>
                        </ul>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    )
    
}

export default DashCard