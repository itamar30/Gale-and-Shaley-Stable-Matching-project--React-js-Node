
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { results } from "../Utils/api";
import "./ResultsPage.css"

export default function ResultsPage(props) {

    const location = useLocation();
    const [resultsList, setResultsList] = useState([]);

    useEffect(() => {
        // take id from user
        const { id } = location.state;
        results(id, data => {
            setResultsList(data);
        });
    }, [location]);

    const renderMatch = useCallback(() => {
        if (!resultsList.length) return;
        const first = resultsList[0];
        const { username, gender, location, email, education, numOfKids, score } = first;
        return (
            <div className="matching">
            <div>Name: {username}</div>
            <div>Gender: {gender}</div>
            <div>location: {location}</div>
            <div>email: {email}</div>
            <div>education: {education}</div>
            <div>numOfKids: {numOfKids}</div>
            <div>Score: {score}</div>
        </div>            
        )
    }, [resultsList]);

    const renderResults = useCallback(() => {
        return resultsList.map((result, key) => {
            return (
                <div className="matching" key={key}>
                    <div>Name: {result.username}</div>
                    <div>Score: {result.score}</div>
                </div>
            )
        })
    }, [resultsList]);

    return (
        <div>
            <div>
                <h1>Results Page</h1>
                <br />
                <h4>Your Match:</h4>
                {renderMatch()}
                <br/>
                <h5>All other results:</h5>
                {renderResults()}
                <div>
                    <Link to="/Matching">See stable matching result</Link>
                </div>

            </div>
            <Link to="/">Home</Link>
        </div>
    )
}
