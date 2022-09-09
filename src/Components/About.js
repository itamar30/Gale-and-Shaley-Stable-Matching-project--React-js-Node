import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { register } from "../Utils/api";
import "./FormInput.css"

function About() {
  const [locationPref, setlocation] = useState('');
  const [genderPref, setgender] = useState('');
  const [numOfKids, setnumOfKids] = useState('');
  const [education, seteducation] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const firstPageData = location.state;

  const changeLocation = (e) => {
    setlocation(e.target.value)
  }
  const changeGander = (e) => {
    setgender(e.target.value)
  }
  const changeNumOfKids = (e) => {
    setnumOfKids(e.target.value)
  }
  const changeEducation = (e) => {
    seteducation(e.target.value)
  }

  const handleForm = (e) => {
    e.preventDefault()
    const data = {
      ...firstPageData,
      locationPref,
      genderPref,
      numOfKids,
      education
    }
    register(data, navigate);
  }
  return (
    <div>
      <div>
        <h1>Preferences Page</h1>
        <br />
      </div>
      <form >
        <br />
        <br />
        <div className="secondForm">
          <div className="grid">
            <div className="g-col-4">
              <select className="form-select" aria-label="Default select example"
                value={locationPref}
                onChange={changeLocation}>
                <option value="">Location</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="Center">Center</option>
              </select>

              <br />
            </div>
            <div className="g-col-4">
              <select className="form-select" aria-label="Default select example"
                value={genderPref}
                onChange={changeGander}>
                <option>Gender</option>
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
                <option value="Couple">Couple</option>
              </select>
            </div>
            <br />
            <div className="g-col-4">
              <select className="form-select" aria-label="Default select example"
                value={numOfKids}
                onChange={changeNumOfKids}>

                <option>Number of kids desires</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <br />
            <div className="g-col-4">
              <div className="mb-3">
                <select className="form-select" aria-label="Default select example"
                  value={education}
                  onChange={changeEducation}>

                  <option>Educational prefferences</option>
                  <option value="religious school">religious school</option>
                  <option value="public school">public school</option>
                </select>

              </div>
              <br />
              <div className="g-col-4">
                <button onClick={handleForm}>Submit</button>

                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </form>
      <Link to="/">Home</Link>
      <br />
      <Link to="/Contact">Third</Link>
      <br />
      <Link to="/FourthPage">FourthPage</Link>
    </div>
  )
}

export default About
