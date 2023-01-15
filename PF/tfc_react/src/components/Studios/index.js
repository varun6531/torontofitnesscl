import {useEffect, useState} from "react";
import Button from "../Button";
import Input from "../Input";
import CurrentLocation from "../CurrentLocation";
import GoogleMaps from "../GoogleMaps";
import {Link} from "react-router-dom";
import "./style.css"
import Layout from "../Layout";

const Studios = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [objects, setObjects] = useState(0)

    const [location, setLocation] = useState('M5S 1C6');
    const [studios, setStudios] = useState([{'id': 0, 'name': '-', 'distance': 0, 'studio_location': '0', 'origin_coordinates': {'lat': 0, 'lng': 0}}])

    const [userStatus, setUserStatus] = useState(0)

    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            setUserStatus(1)
        }
        if (userStatus === 1) {
            const token = JSON.parse(localStorage.getItem("user")).token
            var requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }

            fetch(`http://127.0.0.1:8000/studios/distance/${location}/calculate/${page}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setStudios(data[1])
                    setTotalPages(data[0].pages)
                    setObjects(data[0].objects)
                })
        }
    }, [location, page, userStatus])

    return (<>
        {userStatus === 0 ?
            <>
                <Layout />
                <div className="add-card">
                    <h2>No account has been logged into.</h2>
                    <button className="link-btn">
                        <Link to="/accounts/login">Wish to login?.</Link>
                    </button>
                </div>
                </>
             :
            <>
        <Layout />
        <div className="search">
            <Input
                title="Search by Postal Code (A1A 1A1)"
                value={location}
                update={(value) => setLocation(value)}
            />
            <Button value="Use Current Location" update={() => setLocation(
                document.getElementById("location").innerText
            )}/><CurrentLocation />
        </div>

        <div className="studios-container">
            <div className="studios-child map">
                <h1>Studios near you:</h1>
                <h2>{objects} total studios</h2>
                <table className="styled-table" style={{borderCollapse: 'collapse'}}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Distance Away</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {studios.map(studio => (

                        <tr key={studio.index}
                            style={{textAlign: 'center'}}>
                            <td>{studio.name}</td>
                            <td>{studio.distance}km</td>
                            <td><Link to={`/studio/${studio.id}/${location}`}>Info</Link></td>
                        </tr>

                    ))}
                    </tbody>
                </table>

                {page > 1? <Button value="<-" update={() => setPage(page-1)}/>  : <></>}
                {page < totalPages? <Button value="->" update={() => setPage(page+1)}/> : <></>}
            </div>

            <div id="map">
                {studios.length < 2 ? <></> :
                    location.length < 7?
                        <GoogleMaps
                            lat={location.split(',')[0]}
                            long={location.split(',')[1]}
                            studios={studios}/> :
                        <GoogleMaps
                            lat={studios[0].origin_coordinates.lat}
                            long={studios[0].origin_coordinates.lng}
                            studios={studios}/>}
            </div>

        </div>

    </>}</>)
}

export default Studios