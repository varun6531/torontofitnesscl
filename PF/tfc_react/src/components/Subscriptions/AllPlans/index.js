import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Layout from "../../Layout";
import "./style.css"

const AllPlans = () => {
    const perPage = 25;
    const [data, setData] = useState([]);
    const [max_page, setMaxPage] = useState(10000);
    const [query, setQuery] = useState({page: 1, search: ''})

    useEffect(() => {
        const { page, search } = query;
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        fetch('http://127.0.0.1:8000/subscriptions/view-all-plans/', requestOptions)
            .then(res => res.json())
            .then(json => {
                console.log(json)
                setMaxPage(json.count)
                setData(json.results);
                console.log(data);
            })
    }, [query])

    return (
        <>
                <div><Layout /></div>
            <div id="table-div"><table className="styled-table" style={{borderCollapse: 'collapse'}}>
                <thead>
                <tr style={{textAlign: 'center'}}>
                    <th>Plan Number #</th>
                    <th>Recurrence</th>
                    <th>Cost</th>
                </tr>
                </thead>
                <tbody>
                {data.map((dta, index) => (
                    <tr key={dta.plan_number} style={{textAlign: 'center'}}>
                        <td>{dta.plan_number}</td>
                        <td>{dta.recurrence}</td>
                        <td>{dta.cost}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <button className="page-btn" onClick={() => setQuery({
                ...query,
                page: Math.max(1, query.page - 1)
            })}>prev</button>
            <button className="page-btn" onClick={() => setQuery({
                ...query,
                page: Math.min(Math.ceil(max_page / perPage), query.page + 1)
            })}>next</button>
        </>
    )
}
export default AllPlans;