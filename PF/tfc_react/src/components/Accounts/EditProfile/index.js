
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Layout from "../../Layout";
import "./style.css"

    const EditProfile = () => {
        const navigate = useNavigate();
        const [pass, setPass] = useState('');
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [phoneNumber, setPhoneNumber] = useState('');
        const [avatar, setAvatar] = useState(null);
        const imageRef = React.useRef(null);


        function useDisplayImage() {
            const [result, setResult] = React.useState("");

            function uploader(e) {
                const imageFile = e.target.files[0];

                const reader = new FileReader();
                reader.addEventListener("load", (e) => {
                    setResult(e.target.result);
                });

                reader.readAsDataURL(imageFile);
            }

            return {result, uploader};
        }

        const {result, uploader} = useDisplayImage();

        if (localStorage.getItem("user") === null) {
            return (
                <>
                    <div><Layout /></div>
                <div className="edit-profile">
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
                var txt = ''
                var h3 = document.getElementsByTagName('h3')[0]
                if (h3 !== undefined){
                    document.getElementsByTagName('h3')[0].innerText = txt;
                }
                var formdata = new FormData();
                formdata.append("email", email);
                formdata.append("password", pass);
                formdata.append("first_name", firstName);
                formdata.append("last_name", lastName);
                formdata.append("phone_number", phoneNumber);
                if (avatar === null) {
                    formdata = {"email": email, 'password':pass, "first_name": firstName, "last_name": lastName, "phone_number": phoneNumber, "avatar": null}
                    var requestOptions = {
                        method: 'PUT',
                        image: avatar,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formdata),
                        redirect: 'follow'
                    };

                } else {
                    formdata.append("avatar", avatar, avatar.name);
                    var requestOptions = {
                        method: 'PUT',
                        image: avatar,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formdata,
                        redirect: 'follow'
                    };
                }

                return await fetch('http://127.0.0.1:8000/accounts/edit-profile/', requestOptions
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
                            return navigate("/accounts/view-profile");
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

            return (
                <>
                    <div><Layout /></div>
                <div className="auth-form-container">
                    <h2>Edit Profile</h2>
                    <h3></h3>
                    {result && <div><img class="resize" id="imgs" ref={imageRef} src={result} alt="" /><label htmlFor="imgs" id="imglabel">Your profile picture</label></div>}
                    <form className="register-form" onSubmit={handleSubmit}>
                        <label htmlFor="avatar">Change Profile Picture</label>
                        <input onChange={(e) => {
                            setAvatar(e.target.files[0]);
                            uploader(e);
                        }} name="avatar" id="avatar" type="file" accept="image/*"/>
                        <label htmlFor="firstName">Change First Name</label>
                        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} name="firstName"
                               id="firstName" placeholder="First Name"/>
                        <label htmlFor="lastName">Change Last Name</label>
                        <input value={lastName} onChange={(e) => setLastName(e.target.value)} name="lastName"
                               id="lastName"
                               placeholder="Last Name"/>
                        <label htmlFor="password">Change password</label>
                        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password"
                               placeholder="********"
                               id="password" name="password"/>
                        <label htmlFor="phonenumber">Change Phone Number</label>
                        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} name="phoneNumber"
                               id="phoneNumber" placeholder="Phone number"/>
                        <button type="submit" className="link-btn">Change Profile</button>

                    </form>
                </div>
                    </>
            )
        }
    }


export default EditProfile;