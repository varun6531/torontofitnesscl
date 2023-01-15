import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import Layout from "../../Layout";
import "./style.css"



const ViewProfile = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatar, setAvatar] = useState(null);
    const imageRef = React.useRef(null);

    if (localStorage.getItem("user") === null) {
        return (
            <>
                <div><Layout /></div>
            <div className="view-profile">
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

        const handleView = async () => {

            var txt = ''
            var h3 = document.getElementsByTagName('h3')[0]
            if (h3 !== undefined){
                document.getElementsByTagName('h3')[0].innerText = txt;
            }
            var requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"email":email})
            };
            return await fetch('http://127.0.0.1:8000/accounts/view-profile/', requestOptions
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
                    if (response.status === 200) {
                        var data = await response.json();
                        data = data['results'][0]
                        setFirstName(data['first_name']);
                        setLastName(data['last_name']);
                        setPhoneNumber(data['phone_number']);
                        setAvatar(data['avatar']);


                    } else {
                        var txt = await response.text()
                        var h3 = document.getElementsByTagName('h3')[0]
                        if (h3 === undefined){
                            document.createElement('h3')
                        }
                        document.getElementsByTagName('h3')[0].innerText = txt;
                    }
                })
        }

        handleView();
        return (
            <>
                <div><Layout /></div>
            <div className="auth-form-container">
                <h2>View Profile</h2>
                <h3></h3>
                {avatar && <div><img className="resize" ref={imageRef} src={avatar} alt=""/><label htmlFor="imgs" id="imglabel">Your profile picture</label></div>}
                <div id="table-div"><table className="styled-table" style={{borderCollapse: 'collapse'}}>
                    <thead>
                    <tr style={{textAlign: 'center'}}><th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th></tr>
                    </thead>
                    <tbody>
                    <tr style={{textAlign: 'center'}}><td>{email}</td>
                        <td>{firstName}</td>
                        <td>{lastName}</td>
                        <td>{phoneNumber}</td></tr>
                    </tbody>
                </table></div>

                <button className="link-btn">
                    <Link to="/accounts/edit-profile">Wish to edit profile? Click here.</Link>
                </button>
            </div>
                </>
        )

    }
}


export default ViewProfile