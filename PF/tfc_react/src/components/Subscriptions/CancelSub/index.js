import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Layout from "../../Layout";
const CancelSub = () => {
    const navigate = useNavigate();

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
    } else if (JSON.parse(localStorage.getItem("user")).active === "false") {
        return (
            <>
                <div><Layout /></div>
            <div className="add-card">
                <h2>You dont have an active subscription.</h2>
                <button className="link-btn">
                    <Link to="/subscriptions/view-all-plans">Wish to see all subscription plans?.</Link>
                </button>
            </div>
                </>
        )

    }


    else {

        const token = JSON.parse(localStorage.getItem("user")).token
        const email = JSON.parse(localStorage.getItem("user")).email
        const handleSubmit = async (e) => {

            e.preventDefault();
            const txt = '';
            const h3 = document.getElementsByTagName('h3')[0];
            if (h3 !== undefined) {
                document.getElementsByTagName('h3')[0].innerText = txt;
            }
            var requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"email": email}),
                redirect: 'follow'
            };
            return await fetch('http://127.0.0.1:8000/subscriptions/cancel-subscription/', requestOptions
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
                    const token = JSON.parse(localStorage.getItem("user")).token
                    const email = JSON.parse(localStorage.getItem("user")).email
                    const pass  = JSON.parse(localStorage.getItem("user")).pass
                    localStorage.setItem("user", JSON.stringify({"email": email, "password": pass, "token":token, "active":'false'}));
                    navigate("/studios");
                })
        }

        return (
            <>
                <div><Layout /></div>
            <div className="auth-form-container">
                <h2>Do you wish to cancel your active subscription.</h2>
                <h3></h3>
                <form className="card-form" onSubmit={handleSubmit}>
                    <button type="submit">Cancel My Subscription</button>
                </form>
                <button className="link-btn">
                    <Link to="/subscriptions/edit-subscription">Wish to edit subscription? Click Here.</Link>
                </button>

            </div>
                </>
        )
    }
}

export default CancelSub