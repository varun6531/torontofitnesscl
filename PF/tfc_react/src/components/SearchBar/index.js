import React, {useEffect, useState} from 'react'
import Input from "../Input";
import {Link} from "react-router-dom";
import "./style.css"
import Layout from "../Layout";

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState("")
    //search studios children
    const [selectedOptiontwo, setSelectedOptiontwo] = useState("")
    //search either class or studio
    const [selectedOptionone, setSelectedOptionone] = useState("")
    //search classes children
    const [selectedOptionthree, setSelectedOptionthree] = useState("")
    const [searchOutput, setSearchOutput] = useState([])

    const [alertMsg, setAlertMsg] = useState("")
    const e = 'e'

    const [userStatus, setUserStatus] = useState(0)

    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            setUserStatus(1)
        }})

    useEffect(() => {
        if (userStatus === 1) {
            const token = JSON.parse(localStorage.getItem("user")).token
            var requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            selectedOptionone === "studio" ?
                fetch(`http://127.0.0.1:8000/search/${selectedOptiontwo}/${searchInput}/`, requestOptions)
                    .then(response => response.json())
                    .then(json => {
                        setSearchOutput(json)
                    }) :

                fetch(`http://127.0.0.1:8000/search/classes/${selectedOptionthree}/${searchInput}/`, requestOptions)
                    .then(response => response.json())
                    .then(json => {
                        setSearchOutput(json)
                    })
            selectedOptionthree === 'date' ? setAlertMsg("Please enter in the following format: YYYY-MM-DD") :
                selectedOptionthree === 'time' ? setAlertMsg("Start time to end time: HH:MM:SS HH:MM:SS") :
                    setAlertMsg("")
        }

    }, [selectedOptiontwo, searchInput, selectedOptionone, selectedOptionthree, userStatus])

    return(<>
        {userStatus === 0 ?
            <>
                <div className="add-card">
                    <h2>No account has been logged into.</h2>
                    <button className="link-btn">
                        <Link to="/accounts/login">Wish to login?.</Link>
                    </button>
                </div>
            </>
            :
            <>


                <form>
                    <h2 style={{marginLeft: '38%'}}>Search For:</h2>
                    <div className="form">
                        <div className="search-what">
                            <label>
                                <input
                                    type="radio"
                                    name="what"
                                    value="studio"
                                    onClick={() => setSelectedOptionone("studio")}
                                    className="search-check-input"
                                />
                                Studio
                            </label>
                        </div>

                        <div className="search-what">
                            <label>
                                <input
                                    type="radio"
                                    name="what"
                                    value="schedule"
                                    onClick={() => setSelectedOptionone("schedule")}
                                    className="search-check-input"
                                />
                                Class Schedule
                            </label>
                        </div>
                    </div>

                    {selectedOptionone === 'schedule' ?
                        <>
                        <h2 style={{marginLeft: '38%'}}>Search By:</h2>
                        <div className="form">
                            <div className="search-check">
                                <label>
                                    <input
                                        type="radio"
                                        name="schedule"
                                        value="class_name"
                                        onClick={() => setSelectedOptionthree("class_name")}
                                        className="search-check-input"
                                    />
                                    Class Name
                                </label>
                            </div>

                            <div className="search-check">
                                <label>
                                    <input
                                        type="radio"
                                        name="schedule"
                                        value="coach_name"
                                        onClick={() => setSelectedOptionthree("coach_name")}
                                        className="search-check-input"
                                    />
                                    Coach Name
                                </label>
                            </div>

                            <div className="search-check">
                                <label>
                                    <input
                                        type="radio"
                                        name="schedule"
                                        value="date"
                                        onClick={() => setSelectedOptionthree("date")}
                                        className="search-check-input"
                                    />
                                    Date of Class
                                </label>
                            </div>

                            <div className="search-check">
                                <label>
                                    <input
                                        type="radio"
                                        name="schedule"
                                        value="time"
                                        onClick={() => setSelectedOptionthree("time")}
                                        className="search-check-input"
                                    />
                                    Time of Class
                                </label>
                            </div>
                        </div> </>: <></>}


                    {selectedOptionone === "studio" ?
                        <>
                        <h2 style={{marginLeft: '38%'}}>Search By:</h2>
                        <div className="form">
                        <div className="search-check">
                            <label>
                                <input
                                    type="radio"
                                    name="studio"
                                    value="studio_name"
                                    onClick={() => setSelectedOptiontwo("studio_name")}
                                    className="search-check-input"
                                />
                                Studio Name
                            </label>
                        </div>

                        <div className="search-check">
                            <label>
                                <input
                                    type="radio"
                                    name="studio"
                                    value="amenity"
                                    onClick={() => setSelectedOptiontwo("amenity")}
                                    className="search-check-input"
                                />
                                Amenities
                            </label>
                        </div>

                        <div className="search-check">
                            <label>
                                <input
                                    type="radio"
                                    name="studio"
                                    value="class_name"
                                    onClick={() => setSelectedOptiontwo("class_name")}
                                    className="search-check-input"
                                />
                                Class Name
                            </label>
                        </div>

                        <div className="search-check">
                            <label>
                                <input
                                    type="radio"
                                    name="studio"
                                    value="coach_name"
                                    onClick={() => setSelectedOptiontwo("coach_name")}
                                    className="search-check-input"
                                />
                                Coach Name
                            </label>
                        </div>
                        </div> </>: <></>}
                </form>
            {selectedOptionone !== ""?
                selectedOptiontwo !== ""?
                    <div className="search">
                        <Input
                            title="Search: "
                            value={searchInput}
                            update={(value) => setSearchInput(value)} />
                    </div> :
                selectedOptionthree !== ""?
                    <div className="search">
                        <Input
                            title="Search: "
                            value={searchInput}
                            update={(value) => setSearchInput(value)} />
                    </div> : <></> : <></>
            }

            <p style={{marginLeft: '24%', fontSize: '0.75em', color: 'red'}}>{alertMsg}</p>


        {selectedOptionone === "studio"?
            <table className="styled-table">
                <thead>
                <tr>
                    <th>Search Result</th>
                    <th>Additional Details</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>

                {selectedOptiontwo === 'studio_name'?
                    searchOutput.map(result => (
                        <tr key={result.studio_name}>
                            <td>{result.studio_name}</td>
                            <td>None</td>
                            <td><Link to={`/studio/${result.studio_id}/${e}`}>Info</Link></td>
                        </tr>
                    )) :

                    selectedOptiontwo === 'amenity'?
                        searchOutput.map(result => (
                            <tr key={result.type}>
                                <td>{result.type}</td>
                                <td><div>Corresponding Studio: {result.studio}</div>
                                    <div>Number of Amenities: {result.quantity}</div></td>
                                <td><Link to={`/studio/${result.studio_id}/${e}`}>Info</Link></td>
                            </tr>
                        )) :
                        selectedOptiontwo === 'class_name'?
                                searchOutput.map(result => (
                                    <tr key={result.class_name}>
                                        <td>{result.class_name}</td>
                                        <td><div>Corresponding Studio: {result.studio}</div>
                                        <div>Taught by: {result.coach}</div></td>
                                        <td><Link to={`/studio/${result.studio_id}/${e}`}>Info</Link></td>
                                    </tr>
                            )) :
                            selectedOptiontwo === 'coach_name'?
                                searchOutput.map(result => (
                                    <tr key={result.coach}>
                                        <td>{result.coach}</td>
                                        <td><div>Corresponding Studio: {result.studio_name}</div>
                                            <div>Taught Class: {result.class_name}</div></td>
                                        <td><Link to={`/studio/${result.studio_id}/${e}`}>Info</Link></td>
                                    </tr>
                                )) : <></>}

                </tbody>
            </table>
            : <></>}
            {/*search for schedules*/}
            {selectedOptionone === "schedule"?
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Search Result</th>
                        <th>Additional Details</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>

                    {selectedOptionthree === 'class_name'?
                        searchOutput.map(result => (
                            <tr key={result.name}>
                                <td>{result.name}</td>
                                <td><div>Studio:{result.studio_name}</div>
                                    <div>Class Schedule:{result.schedule}</div>
                                    <div>Taught by:{result.coach}</div></td>
                                <td><Link to={`/studio/${result.studio_id}/${e}`}>Info</Link></td>
                            </tr>

                        )) :

                        selectedOptionthree === 'coach_name'?
                            searchOutput.map(result => (
                                <tr key={result.name}>
                                    <td>{result.name}</td>
                                    <td><div>Studio: {result.studio_name}</div>
                                        <div>Schedule: {result.schedule}</div>
                                        <div>Taught by: {result.coach}</div></td>
                                    <td><Link to={`/studio/${result.studio_id}/${e}`}>Info</Link></td>
                                </tr>
                            )) :
                            selectedOptionthree === 'date'?
                                searchOutput.map(result => (
                                    <tr key={result.name}>
                                        <td>{result.name}</td>
                                        <td><div>Studio: {result.studio_name}</div>
                                            <div>Schedule:{result.schedule}</div>
                                            <div>Taught by: {result.coach}</div></td>
                                        <td><Link to={`/studio/${result.studio_id}/${e}`}>Info</Link></td>
                                    </tr>
                                )) :
                                selectedOptionthree === 'time'?
                                    searchOutput.map(result => (
                                        <tr key={result.name}>
                                            <td>{result.name}</td>
                                            <td><div>Studio: {result.studio_name}</div>
                                                <div>Schedule:{result.schedule}</div>
                                                <div>Taught by: {result.coach}</div></td>
                                            <td><Link to={`/studio/${result.studio_id}/${e}`}>Info</Link></td>
                                        </tr>
                                    )) : <></>}

                    </tbody>
                </table>
                : <></>}
        </>}</>
    )
}
export default SearchBar