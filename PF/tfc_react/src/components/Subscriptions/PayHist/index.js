import React, {useContext, useEffect, useState} from "react";
import PayTable from "./PayTable";
import PayContext from "../../../Contexts/PayContext";
import {Link} from "react-router-dom";
import Layout from "../../Layout";
import "./style.css"

const PayHist = () => {
    const perPage = 25;
    const [params, setParams] = useState({page: 1, search: ""})
    const [max_page, setMaxPage] = useState(10000);
    const [userStatus, setUserStatus] = useState(0)

    const { data, setData } = useContext(PayContext);

    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            setUserStatus(1)
        } if(userStatus === 1) {
        const { page, search } = params;
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
        fetch('http://127.0.0.1:8000/subscriptions/payment-history/', requestOptions)
            .then(res =>  res.json())
            .then( json => {
                console.log(json)
                setMaxPage(json.count)
                setData(json.results);
                console.log(data);
            })
    }}, [params])

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
                <div><Layout /></div>
            <PayTable perPage={perPage} params={params} />

            <button className="page-btn" onClick={() => setParams({
                ...params,
            })}> Show My Payment History</button>

            <button className="page-btn" onClick={() => setParams({
                ...params,
                page: Math.max(1, params.page - 1)
            })}>
                prev
            </button>
            <button className="page-btn" onClick={() => setParams({
                ...params,
                page: Math.min(Math.ceil(max_page / perPage), params.page + 1)
            })}>
                next
            </button >
            <button className="link-btn">
                <Link to="/subscriptions/future-payments">To see next billing, Click here.</Link>
            </button>
        </>}</>
    )
}

export default PayHist;