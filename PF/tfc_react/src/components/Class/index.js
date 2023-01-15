import { useEffect, useState } from "react";
import axios from "axios";
import { render } from "@testing-library/react";
import Button from "../Button";
export default function Class(props) {
    const [main_class, setMainClass] = useState([])
    const [page, setpage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const day = {
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thrusday",
        "5": "Friday",
        "6": "Satuarday",
        "7": "Sunday"
    }
    // const token = JSON.parse(localStorage.getItem("user")).token
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjcwNjE1OTY3LCJpYXQiOjE2NzA1Mjk1NjcsImp0aSI6IjVjNzM2NzA5NzhhYzQyYmVhMzdlM2Q3NGFkNWY2OWNmIiwidXNlcl9pZCI6NX0.6clmiCfssRgtqRhlIwb5-2ofgB9Fn_kGgTVkDf-7PMU"
    const config = {
        headers: { Authorization: 'Bearer '+ token}
    }
    
    useEffect(() => {
        axios.get("http://localhost:8000/classes/"+ props.studio_id +"/all-classes/" + page+"/", config)
            .then(json => {
                setMainClass(json.data[1])
                setTotalPages(json.data[0].pages)
                return json.data[1]
            }).catch(err => {
                if (err.response.status === 401){
                    render(
                        <div>
                            <h1>error: 401</h1>
                            User Unauthorized, please to login first!
                        </div>
                    )
                }
                else{
                    render(
                        <div>{err.message}</div>
                    )
                }
            })

    }, [page])
    function handleEnrolAll(e, key) {
        const url = "http://127.0.0.1:8000/classes/" + key + "/enrol-all/"
        axios.post(url, '', config).then(json => console.log(json.data))
    }
    function handleEnorlOne(e) {
        e.preventDefault()
        const url = "http://localhost:8000/classes/" + e.target[0].value + "/enrol/"
        axios.post(url, '', config).then(res => console.log(res.data))
    }
    console.log(main_class)
    return (
        <div>
            {Object.keys(main_class).map((key, index) => {
                const each_class = main_class[key]
                const start_date = each_class.start_date.split("-")
                const end_date = each_class.end_date.split("-")
                console.log(each_class)
                return (
                    <div key={index}>
                        <h1>
                            {each_class.name}
                        </h1>
                        <h2>
                            {each_class.description}
                        </h2>
                        <h3>
                            Every {day[each_class.recurring_day]}. From {start_date[0]}, {start_date[1]}/{start_date[2]} to {end_date[1]}/{end_date[2]}
                        </h3>
                        <button onClick={e => handleEnrolAll(e, each_class.class_id)}>Join Full course!</button> or Try one class!
                        <form onSubmit={handleEnorlOne}>
                            <select name="date" id="date">
                                {
                                    Object.keys(each_class.recurring_class).map((key, index) =>{
                                        return (
                                            <option value = {each_class.recurring_class[key].recurring_class_id}>{each_class.recurring_class[key].date}</option>
                                            )
                                    })
                                }
                            </select>         
                            <input type="submit" value="Enroll" />
                        </form>
                    </div>
                );
            })}
             {page > 1? <Button value="<-" update={() => setpage(page-1)}/>  : <></>}
            {page < totalPages? <Button value="->" update={() => setpage(page+1)}/> : <></>}
        </div>
       
    );
}


