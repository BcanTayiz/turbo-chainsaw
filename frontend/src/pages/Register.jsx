import React from 'react'
import Form from '../components/Form'
import { Link } from 'react-router-dom'
import '../styles/Register.css'

function Register() {
  return (
    <div>
        <Form route="/api/user/register/" method="register"/>
        <div className="register-acc">
                <Link to="/login">Do you have an account ?</Link>
        </div>
    </div>
  )
}

export default Register