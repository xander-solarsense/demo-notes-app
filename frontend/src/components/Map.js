import React from 'react'
import GoogleMapReact from 'google-map-react'
import {Icon} from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'

const LocationPin = ({text}) => {
    <div className='pin'>
        <Icon icon={locationIcon} className="pin-icon" />
        <p className="pin-text">{text}</p>
    </div>
}

const location = {
    address: '14 Forkert Rd, Ohaupo 3803',
    lat: -37.915558, 
    lng: 175.3051230,
}
const zoomLevel = 10


const Map = ({location, zoomLevel}) => (
    <div className="map">
        <div className="google-map">
            <GoogleMapReact
                bootstrapURLKeys={{key: 'AIzaSyD3p5Kkl1kQBnKX2U5y22pH6AbjZyIRjp8'}}
                defaultCenter={location}
                defaultZoom={zoomLevel}
            >
            <LocationPin
                lat={location.lat}
                lng={location.lng}
                text={location.address}
            />
            </GoogleMapReact>
        </div>
    </div>
)

export default Map