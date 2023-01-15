import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Layout from "../../Layout";
import "./style.css"
const FutPay = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
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
                    </>)
        }
        const token = JSON.parse(localStorage.getItem("user")).token
        const email = JSON.parse(localStorage.getItem("user")).email
        var requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"email":email}),
        }
        fetch('http://127.0.0.1:8000/subscriptions/future-payments/', requestOptions)
            .then(res =>  res.json())
            .then( json => {
                setData(json.results)
                console.log(json.results)
            })
    }, [])

    const email = JSON.parse(localStorage.getItem("user")).email
    return (
        <>
            <div><Layout /></div>
            <h2>Upcoming Payment Details:</h2>
            <div id="table-div"><table className="styled-table" style={{borderCollapse: 'collapse'}}>
                <thead>
                <tr style={{textAlign: 'center'}}>
                    <th>User</th>
                    <th>Active Subscription (ID)</th>
                    <th>Payment Information</th>
                    <th>Next Payment Date</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
                </thead>
                <tbody>
                {data.map((dta, index) => (
                    <tr key={email} style={{textAlign: 'center'}}>
                        <td>{email}</td>
                        <td>{dta.pk}</td>
                        <td>{"Card_id:" + dta.payment_info}</td>
                        <td>{dta.next_payment_day}</td>
                        <td>{dta.start_date}</td>
                        <td>{dta.end_date = dta.end_date ? dta.end_date : 'no end date'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <button className="link-btn">
                <Link to="/subscriptions/payment-history">To see billing records, Click here.</Link>
            </button>
        </>
    )

}

export default FutPay;