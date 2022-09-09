
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { stableMatching } from "../Utils/api";
import "./MatchingPage.css"


export default function MatchingPage(props) {

    const [matchingResults, setMatchingResults] = useState(null);

    useEffect(() => {
        stableMatching(data => {
            setMatchingResults(data);
        });
    }, []);

    const renderMatchingResults = useCallback(() => {
        if (!matchingResults) return;
        const { men, error } = matchingResults;
        if (error) return <div className="error">Couples are not equal - Can't run stable matching</div>
        // array [], object { "ofer": {...}, "moran": {...}}  
        const menList = Object.keys(men);
        return menList.map(name => {
            const man = men[name];
            return (<div key={name}>{name} is with {man.match}</div>);
        });
    }, [matchingResults]);

    return (
        <div>
            <div>
                <h1>Stable matching results</h1>
                <br />
                <div className="matching-results">
                    {renderMatchingResults()}
                </div>
            </div>
            <Link to="/">Home</Link>
        </div>
    )
}
