import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Layout from "../../Layout";
import "./style.css";

const AddCard = () => {
        const navigate = useNavigate();
        const [CardNumber, setCardNumber] = useState('');
        const [CardExpiry, setCardExpiry] = useState('');
        const [CardCode, setCardCode] = useState('');

        if (localStorage.getItem("user") === null) {
            return (
                <>
                    <div><Layout /></div>
                <div className="add-card">
                    <h2>No account has been logged into.</h2>
                    <button className="link-btn">
                        <Link to="/accounts/login">Wish to login?.</Link>
                    </button>
                </div>
                    </>
            )
        } else {

            const token = JSON.parse(localStorage.getItem("user")).token
            const email = JSON.parse(localStorage.getItem("user")).email
        const handleSubmit = async (e) => {

            e.preventDefault();
            const txt = '';
            const h3 = document.getElementsByTagName('h3')[0];
            if (h3 !== undefined){
                document.getElementsByTagName('h3')[0].innerText = txt;
            }
            var requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"email":email, "cc_number":CardNumber, "cc_expiry":CardExpiry, "cc_code": CardCode}),
                redirect: 'follow'
            };
            return await fetch('http://127.0.0.1:8000/subscriptions/create-credit-card/', requestOptions
                //     {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     },
                //     image: avatar,
                //     body: JSON.stringify({"email": email, "password": pass, "first_name": firstName, "last_name": lastName, "phone_number":
                //      phoneNumber, "avatar" : avatar }),
                // }
            )
                .then(async (response) => {
                    var txt = await response.text()
                    var txt = String(txt)
                    if (response.status === 200) {
                        return navigate("/subscriptions/subscribe");
                        //     var data;
                        //     return await fetch('http://127.0.0.1:8000/api/token/', {
                        //         method: 'POST',
                        //         headers: {
                        //             'Content-Type': 'application/json'
                        //         },
                        //         body: JSON.stringify({"email": email, "password": pass})
                        //     }).then(async (response) => {
                        //         data = await response.json();
                        //         if (data["access"]) {
                        //             localStorage.setItem("user", JSON.stringify({"email": email, "password": pass, "token":data["access"]}));
                        //             }
                        //          else {
                        //             console.log("access token generation error");
                        //          }}
                        //     )

                    } else if(response.status === 400 && txt === "{\"user\":[\"card info with this user already exists.\"]}") {

                        var requestOptions = {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({"email":email, "cc_number":CardNumber, "cc_expiry":CardExpiry, "cc_code": CardCode}),
                            redirect: 'follow'
                        };
                        return await fetch('http://127.0.0.1:8000/subscriptions/create-credit-card/', requestOptions
                            //     {
                            //     method: 'POST',
                            //     headers: {
                            //         'Content-Type': 'multipart/form-data'
                            //     },
                            //     image: avatar,
                            //     body: JSON.stringify({"email": email, "password": pass, "first_name": firstName, "last_name": lastName, "phone_number":
                            //      phoneNumber, "avatar" : avatar }),
                            // }
                        ).then(async (response) => {
                            var txt = await response.text()
                            var txt = String(txt)
                            if (response.status === 200) {
                                return navigate("/subscriptions/subscribe");
                                //     var data;
                                //     return await fetch('http://127.0.0.1:8000/api/token/', {
                                //         method: 'POST',
                                //         headers: {
                                //             'Content-Type': 'application/json'
                                //         },
                                //         body: JSON.stringify({"email": email, "password": pass})
                                //     }).then(async (response) => {
                                //         data = await response.json();
                                //         if (data["access"]) {
                                //             localStorage.setItem("user", JSON.stringify({"email": email, "password": pass, "token":data["access"]}));
                                //             }
                                //          else {
                                //             console.log("access token generation error");
                                //          }}
                                //     )

                            }
                            else{
                                var h3 = document.getElementsByTagName('h3')[0]
                                if (h3 === undefined){
                                    document.createElement('h3')
                                }
                                document.getElementsByTagName('h3')[0].innerText = txt;
                            }
                        })


                        }

                        else{
                        var h3 = document.getElementsByTagName('h3')[0]
                        if (h3 === undefined){
                            document.createElement('h3')
                        }
                        document.getElementsByTagName('h3')[0].innerText = txt;
                    }
                })
        }

        return (
            <>
                <div><Layout /></div>
            <div className="auth-form-container" >
                <h2>Enter Card Details to Add/Update Card</h2>
                <h3></h3>
                <div id="main">
                    <form className="wrapper" onSubmit={handleSubmit} id="frm">
                    <label htmlFor="cnum" className ="label">Card Number:</label>
                    <input value={CardNumber} onChange={(e) => setCardNumber(e.target.value)}type="password" placeholder="16-digit card number" id="cnum" name="cnum" />
                    <label htmlFor="cexp" className ="label">Card Expiry Date:</label>
                    <input value={CardExpiry} onChange={(e) => setCardExpiry(e.target.value)} type="date" placeholder="YYYY-MM-DD" id="cexp" name="cexp" />
                    <label htmlFor="ccode" className ="label">Card Security Code:</label>
                    <input value={CardCode} onChange={(e) => setCardCode(e.target.value)} name="password" id="ccode" placeholder="*******" />
                    <button type="submit" className ="label">Add Credit Card Information</button>
                    </form>
                </div>
            </div>
            </>
        )
    }
}

export default AddCard;