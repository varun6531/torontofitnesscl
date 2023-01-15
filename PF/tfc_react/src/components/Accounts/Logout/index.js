import {Link, useNavigate} from "react-router-dom";
import React from "react";
import Layout from "../../Layout";
import "./style.css";

const Logout = () => {
    const navigate = useNavigate();
    if (localStorage.getItem("user") === null){

        return (
            <>
                <div><Layout /></div>
            <div className="auth-form-container">
                <h2>No account has been logged into.</h2>
                <button className="link-btn">
                    <Link to="/accounts/login">Wish to login?.</Link>
                </button>
            </div>
            </>
        )
    } else{

    const handleSubmit = async (e) => {
        e.preventDefault();
        var txt = ''
        var h3 = document.getElementsByTagName('h3')[0]
        if (h3 !== undefined){
            document.getElementsByTagName('h3')[0].innerText = txt;
        }

    const token = JSON.parse(localStorage.getItem("user")).token;
    const email = JSON.parse(localStorage.getItem("user")).email;
    const pass = JSON.parse(localStorage.getItem("user")).password;

        console.log({'Authorization': `Bearer ${token}`})

    return await fetch('http://127.0.0.1:8000/accounts/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: {"email": email, "password": pass}
    }).then(async (response) => {
        if (response.status === 200) {
            localStorage.removeItem("user");
            return navigate('/');

        } else {
            var txt = await response.text();
            var h3 = document.getElementsByTagName('h3')[0]
            if (h3 === undefined){
                document.createElement('h3')
            }
            document.getElementsByTagName('h3')[0].innerText = txt;
        }
    })}

    return (
        <>
            <div><Layout /></div>
        <div className="auth-form-container">
            <h2>Wish to Logout?</h2>
            <h3></h3>
            <form className="logout-form" onSubmit={handleSubmit}>
                <button id="logout" type="submit">Logout</button>
            </form>
            <button className="link-btn" id="link-btn">
                <Link to="/studios">Wish to return? Return Home.</Link>
            </button>
        </div>
            </>
    )
}}
export default Logout
