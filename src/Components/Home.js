//import React, {useState} from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./FormInput.css"

function Home() {

    const [details, setDetails] = useState({});
    const navigate = useNavigate();

    const nextStep = (e) => {
        e.preventDefault();
        navigate('/About', { state: details });
    };

    return (
        <div className="App">
            <div>
                <Link to="/Matching">Stable matching</Link>
            </div>

            <div>
                <form>

                    <h1>Registration</h1>


                    <input placeholder="Username" type="text"
                        onChange={(e) => {
                            setDetails({ ...details, username: e.target.value });
                        }}
                    />
                    <br />

                    <input placeholder="Email" type="text"
                        onChange={(e) => {
                            setDetails({ ...details, email: e.target.value });
                        }} />
                    <br />

                    <input placeholder="Gender" type="text"
                        onChange={(e) => {
                            setDetails({ ...details, gender: e.target.value });
                        }} />

                    <br />
                    <input placeholder="Location" type="text"
                        onChange={(e) => {
                            setDetails({ ...details, location: e.target.value });
                        }} />

                    <br />

                    <button onClick={nextStep}>Register</button>
                </form>
            </div>
        </div>

    );
}

export default Home;
