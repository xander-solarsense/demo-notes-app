import React, {useState, useEffect} from "react"


export default function SpotPrices() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
  
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
      fetch("https://emi.azure-api.net/real-time-prices/?$filter=PointOfConnectionCode eq 'HLY0331'",{
      method: "GET",
      headers: {
          'Ocp-Apim-Subscription-Key': 'f0ab504f60704e0f9531c07e2a38713f',
          'content-type' : 'application/JSON'
      },
    })
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, [])
  
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <p>
          {items}
        </p>
      );
    }
  }