import React, { useState } from "react";
import {Link, useNavigate,} from "react-router-dom";
import Layout from "../../Layout";
import "./style.css";

 const Login = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
     if (localStorage.getItem("user") !== null) {
         const email = JSON.parse(localStorage.getItem("user")).email
         return (
             <>
                 <div><Layout /></div>
                 <div className="add-card">
                     <h2>Already logged into {email}</h2>
                     <button className="link-btn">
                         <Link to="/">Go to Homepage.</Link>
                     </button>
                     <button className="link-btn">
                         <Link to="/accounts/logout">Wish to logout? Click here.</Link>
                     </button>
                 </div>
             </>)
     }

     const handleSubmit = async (e) => {
         e.preventDefault();
         var txt = ''
         var h3 = document.getElementsByTagName('h3')[0]
         if (h3 !== undefined){
             document.getElementsByTagName('h3')[0].innerText = txt;
         }
         return await fetch('http://127.0.0.1:8000/accounts/login/', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({"email": email, "password": pass}),
         })
             .then(async (response) => {
                 if (response.status === 200) {
                     var data;
                     return await fetch('http://127.0.0.1:8000/api/token/', {
                         method: 'POST',
                         headers: {
                             'Content-Type': 'application/json'
                         },
                         body: JSON.stringify({"email": email, "password": pass})
                     }).then(async (response) => {
                         data = await response.json();
                         if (data["access"]) {
                             localStorage.setItem("user", JSON.stringify({"email": email, "password": pass, "token":data["access"], "active":'maybe'}));
                             return navigate("/studios");
                         }
                         else {
                             console.log("access token generation error");
                         }}
                     )

                 } else {
                     var txt = await response.text()
                     var h3 = document.getElementsByTagName('h3')[0]
                     if (h3 === undefined){
                         h3 = document.createElement('h3');
                     }
                     h3.innerText = txt;
                     console.log(document.createElement('h3'))
                 }
             })
     }

    return (
        <>
            <div><Layout /></div>
        <div className="auth-form-container">
            <h2>Login</h2>
            <h3></h3>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="password">Password:</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            <button className="link-btn">
                <Link to="/accounts/register">Don't have an account? Register here.</Link>
            </button>
        </div>
            </>
    )
}

    export default Login;