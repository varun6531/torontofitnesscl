import {Component, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import Layout from "../Layout";
import "./style.css"

const StudioInfo = () => {

    const {id, location} = useParams();

    const [info, setInfo] = useState({})
    const [images, setImages] = useState([])

    useEffect(() => {
        setImages(info.images)
    }, [info])

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user")).token
        var requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        fetch(`http://127.0.0.1:8000/studios/${id}/${location}/information/`, requestOptions)
            .then(response => response.json())
            .then(data => {
                // info.name = data.name
                // info.address = data.address
                // info.geographical_location = data.geographical_location
                // info.link = data.link
                setInfo(data)
            })
    },[id, location])

    return (<>
        <Layout />
        <h2>Studio Name: </h2><p>{info.name}</p>
        <h2>Studio Address: </h2><p>{info.address}</p>
        <h2>Studio Phone Number: </h2><p>{info.phone_number}</p>
        <h2><a href={info.link}>Directions</a></h2>
        <h2>Studio Images: </h2>
        <div>
            {images?.map(image => (
                <img className="imgs" src={"http://localhost:8000"+image} alt={"Studio Image"}></img>
            ))}
        </div>
    </>)
}

export default StudioInfo