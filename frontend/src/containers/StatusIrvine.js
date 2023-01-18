import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'

const siteName = "irvine"

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

const formatStatus = (inv1Status, inv2Status, fixedStatus) => {
    if (inv1Status != 0 | inv2Status != 0 | fixedStatus != 0) {
        var bgcolor = 'success'
        var inverterMsg = "No current errors"
        var status = 'fine'
        return (
            <div>
            <p>Inv 1 Status:{inv1Status}</p>
            <p>Inv 2 Status: {inv2Status}</p>
            <p>Fixed Inv Status: {fixedStatus}</p>
            </div>
        )}
    else {
        return (
            <div>
            </div>
        )
    }
    
}
const StatusIrvine = () => {
    const [trackedData,setTrackedData] = useState(0)
    const [fixedData,setFixedData] = useState(0)
    const [isLoading, setIsLoading] = useState(true);

    var dt = new Date();
    var isoTimeNow = toIsoString(dt)
    var isoDateToday = isoTimeNow.slice(0,10)
    var trackedDeviceID = `${siteName}_tracked_2s`
    var fixedDeviceID = `${siteName}_fixed_2s`
    var trackedLimitQueryString = `${trackedDeviceID}/${isoDateToday}/limit/1`
    var fixedLimitQueryString = `${fixedDeviceID}/${isoDateToday}/limit/1`
    var baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`
    var trackedFullURL = `${baseURL}${trackedLimitQueryString}`
    var fixedFullURL = `${baseURL}${fixedLimitQueryString}`

    const fetchData = async () => {
        try{
        const trackedResult = await fetch(`${trackedFullURL}`)
        const trackedJson = await trackedResult.json()
        setTrackedData(trackedJson)
        console.log("tracked data: ", trackedData)

        const fixedResult = await fetch(`${fixedFullURL}`)
        const fixedJson = await fixedResult.json()
        setFixedData(fixedJson)
        console.log("fixed data: ", fixedData)

        } catch (error) {
            console.log(error)
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData()
        const intervalId = setInterval(() => {
            console.log("updated Status!")
            fetchData()
        },30000)
        return () => clearInterval(intervalId)
    }, [])

    if(!isLoading) {
        var inv1Status = trackedData.Items.map(x => x.error_code_inv_1)
        var inv2Status = trackedData.Items.map(x => x.error_code_inv_2)
        var fixedStatus = fixedData.Items.map(x => x.error_code)
        // var inv1Status = 0
        // var inv2Status = 0
        // var fixedStatus = 0

        console.log("Inv1 Status: ", inv1Status, "Inv2 Status: ", inv2Status)
    
        if (inv1Status == 0 && inv2Status == 0 && fixedStatus == 0) {
            var bgcolor = 'success'
            var inverterMsg = "No current errors"
            var status = 'fine'
            
        } else {
            var bgcolor = 'warning'
            var inverterMsg = <a href="https://www.fallonsolutions.com.au/solar/information/fronius-inverter-error-codes">Refer to Fronius error codes</a>
        }
        
        return (
         <Card bg={bgcolor} text='white' className='mt-3 mb-3'>
            <Card.Title>Inverter Status</Card.Title>
            <Card.Body>
                {formatStatus(inv1Status, inv2Status, fixedStatus)}
                <p>{inverterMsg}</p>
            </Card.Body>
         </Card>
     )

    } else {
        return (
            <Card >
               <Card.Title>&nbsp;Inverter Status</Card.Title>
               <Card.Body>
                <Spinner animation="border"/>
               </Card.Body>
   
            </Card>
        )   
    }

}

export default StatusIrvine