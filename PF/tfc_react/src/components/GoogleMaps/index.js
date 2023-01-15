import { Component } from "react";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";

const mapStyles = {
    width: '50%',
    height: '50%',
};

//
export class GoogleMaps extends Component {

    render() {
        const {lat, long, studios} = this.props
        return (
            <Map
                google={this.props.google}
                zoom={8}
                style={mapStyles}
                initialCenter={{lat: 43.6616, lng: -79.4005}}
                center={{lat: lat, lng: long}}
            >
                {studios.map((studio, index) => {
                    return <Marker key={index} id={index} position={{ lat: parseFloat(studio.studio_location.split(',')[0]),
                                                                      lng: parseFloat(studio.studio_location.split(',')[1])}} />
                })}


            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAqacoZngz8V4d51H5mshGuqsj_AFQeQ4A'
})(GoogleMaps);