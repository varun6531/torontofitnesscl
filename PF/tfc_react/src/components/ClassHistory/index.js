import axios from "axios"
import { useEffect, useState } from "react";
import Button from "../Button";
import Layout from "../Layout";
export default function ClassHistory() {
    const [user_classes, setUserClasses] = useState()
    const [hist_page, setHistPage] = useState(1)
    const [sch_page, setSchPage] = useState(1)

    useEffect(() => {
        console.log("hello")
        const url = "http://localhost:8000/classes/view-classes/" + hist_page + "/" + sch_page + "/"
        // const token = JSON.parse(localStorage.getItem("user")).token
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjcwNjE1OTY3LCJpYXQiOjE2NzA1Mjk1NjcsImp0aSI6IjVjNzM2NzA5NzhhYzQyYmVhMzdlM2Q3NGFkNWY2OWNmIiwidXNlcl9pZCI6NX0.6clmiCfssRgtqRhlIwb5-2ofgB9Fn_kGgTVkDf-7PMU"
        const config = {
            headers: { Authorization: 'Bearer ' + token }
        }
        axios.get(url, config)
            .then(response => {
                console.log(response)
                setUserClasses(response.data)
                return response.data
            })
            .catch(err => console.log(err.response))
    }, [hist_page, sch_page])

    console.log(user_classes)
    return (
        user_classes ? <>
        <Layout />
        <div>
            <div>
                <h2 style={{"text-align": 'center'}}>Upcoming Classes</h2>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Studio</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(user_classes.schedule.data).map((key) => {
                            return (
                                <tr>
                                    <td>{user_classes.schedule.data[key].class_name}</td>
                                    <td>{user_classes.schedule.data[key].studio}</td>
                                    <td>{key}</td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
                {sch_page > 1 ? <Button value="<-" update={() => setSchPage(sch_page - 1)} /> : <></>}
                {sch_page < user_classes.schedule.page_num ? <Button value="->" update={() => setSchPage(sch_page + 1)} /> : <></>}
            </div>
            <div>
                <h2 style={{"text-align": 'center'}}>Class history</h2>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Studio</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(user_classes.history.data).map(key => {
                                return (
                                    <tr>
                                        <td>{user_classes.history.data[key].class_name}</td>
                                        <td>{user_classes.history.data[key].studio}</td>
                                        <td>{key}</td>
                                    </tr>
                                )
                            })

                        }
                    </tbody>
                </table>
                {hist_page > 1 ? <Button value="<-" update={() => setHistPage(hist_page - 1)} /> : <></>}
                {hist_page < user_classes.history.page_num ? <Button value="->" update={() => setHistPage(hist_page + 1)} /> : <></>}
            </div>
        </div>
    </>
    : <></>)
}