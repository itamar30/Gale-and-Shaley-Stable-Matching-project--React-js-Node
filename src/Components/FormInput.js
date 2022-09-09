import React from 'react'
import "./FormInput.css"



const FormInput = (props) => {
  return (
    <div className='FormInput'>
      <label></label>
      <input placeholder={props.placeholder} name = {props.name}/>
    </div>
  )
}

export default FormInput