import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

const siteName = "te_anga"

const getIsoTimeNow = () => {
    var dt = new Date();
    var isoTime = toIsoString(dt);
  
    return isoTime
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

const Errors = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState("Today")
    const [errors, setErrors] = useState([])
    
    const fetchData = async () => {
        var isoTimeNow = getIsoTimeNow()
        var isoDateToday = isoTimeNow.slice(0,10)
        var isoTimeYesterday = getIsoTimeYesterday()
        var isoDateYesterday = isoTimeYesterday.slice(0,10)
        var isoTimeLast30 = getIsoTimeLast30()
        var isoTimeLastWeek = getIsoTimeLastWeek()

        const deviceID= `${siteName}_error`
        const baseURL =  `https://nh80hr43o5.execute-api.us-east-1.amazonaws.com/items/`
        if (query == "Today") {
            var queryString = `${deviceID}/${isoDateToday}`
        } else if (query == "Yesterday") {
            var queryString = `${deviceID}/${isoDateYesterday}`
        } else if (query == "Last 7 Days") {
            var queryString = `${deviceID}/${isoTimeLastWeek}/${isoTimeNow}`
        } else if (query == "Last 30 Days") {
            var queryString = `${deviceID}/${isoTimeLast30}/${isoTimeNow}`
        }
       
        var fullURL = `${baseURL}${queryString}`

        
        try{
            const result = await fetch(`${fullURL}`)
            const json = await result.json()
            // console.log({fullURL})
            setErrors(json)
            console.log('errors updated: ', json)
            
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
    };
    useEffect(() => {
        fetchData()
        
        const intervalId = setInterval(() => {
            fetchData()
        },60000)
        return () => clearInterval(intervalId)
    }, [query])

    if (! isLoading) {
        var errorList = errors.Items
        
        return (
            <div >
                <Card className='mb-3 mt-3'>
                <Card.Title>
                    Inverter Errors <a href="https://www.fallonsolutions.com.au/solar/information/fronius-inverter-error-codes">Refer to Fronius error codes</a>
                </Card.Title>
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

                <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Error Code</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {errorList.map((item, index) => (
                    <tr key={index}>
                        <td>{item.error_code}</td>
                        <td>{item.timestamp}</td>
                    </tr>
                    ))}
                </tbody>
                </Table>
                </Card>
            </div>
        )   
    } else {
        return (
            <div>
                <Spinner animation="border"/>
            </div>
        )   
    }
}
export default Errors