import React from 'react'
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import Container from 'react-bootstrap/Container'

const Weather = () => {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: 'a13c811babaa5866bf49af251cf8e390',
    lat: '-37.91535',
    lon: '175.30397',
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });
  return (
    <div className='mb-3 mt-3'>
    <Container>
        <ReactWeather
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel="Ohaupo"
      unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
      showForecast={false}
    />
    </Container>
    </div>
  );
};
export default Weather