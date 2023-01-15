import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Layout from "../../Layout";
const EditSub = () => {

    const navigate = useNavigate();
    const [planNumber, setPlanNumber] = useState('');

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
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"email": email, "plan_number": planNumber}),
                redirect: 'follow'
            };
            return await fetch('http://127.0.0.1:8000/subscriptions/edit-subscription/', requestOptions
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
                    txt = String(txt)
                    if (response.status === 200 && txt === "{\"error\":\"Please choose a valid subscription plan.\"}") {
                        var h3 = document.getElementsByTagName('h3')[0]
                        if (h3 === undefined) {
                            document.createElement('h3')
                        }
                        document.getElementsByTagName('h3')[0].innerText = txt;

                    } else if (response.status === 200) {
                        return navigate("/studios/");
                    } else {
                        var h3 = document.getElementsByTagName('h3')[0]
                        if (h3 === undefined) {
                            document.createElement('h3')
                        }
                        document.getElementsByTagName('h3')[0].innerText = txt;
                    }
                })
        }

        return (
            <>
                <div><Layout /></div>
            <div className="auth-form-container">
                <h2>Please enter the plan number you wish to switch to</h2>
                <h3></h3>
                <form className="card-form" onSubmit={handleSubmit}>
                    <label htmlFor="choice">Plan Number:</label>
                    <input value={planNumber} onChange={(e) => setPlanNumber(e.target.value)}type="number" placeholder="plan number" id="choice" name="choice" />
                    <button type="submit">Subscribe</button>
                </form>
                <button className="link-btn">
                    <Link to="/subscriptions/cancel-subscription">Wish to cancel subscription? Click Here.</Link>
                </button>

            </div>
                </>
        )
    }
}

export default EditSub