import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'


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

const Status = () => {
    const [data,setData] = useState(0)
    const [isLoading, setIsLoading] = useState(true);

    var dt = new Date();
    var isoTimeNow = toIsoString(dt)
    var isoDateToday = isoTimeNow.slice(0,10)
    var device_id = 'x_inv_2s'
    var limitQueryString = `${device_id}/${isoDateToday}/limit/1`
    var baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`
    var fullURL = `${baseURL}${limitQueryString}`

    const fetchData = async () => {
        try{
        const result = await fetch(`${fullURL}`)
        const json = await result.json()
        
        setData(json)
    
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
        var status = data.Items.map(x => x.error_code)
        console.log("status", status)
        if (status == 0) {
            var bgcolor = 'success'
            var inverterMsg = "No current errors"
        } else {
            var bgcolor = 'warning'
            const errorCodeLink = 'Refer to Fronius error codes'
    
        }
     return (
         <Card bg={bgcolor} text='white' className='mt-3 mb-3'>
            <Card.Title>&nbsp;Inverter Status: {status}</Card.Title>
            <Card.Body>
                {status == 0? <p>{inverterMsg}</p> : <a href="https://www.fallonsolutions.com.au/solar/information/fronius-inverter-error-codes">Refer to Fronius error codes</a>}
            </Card.Body>

         </Card>
        
         
     )   
    }

}

export default Status