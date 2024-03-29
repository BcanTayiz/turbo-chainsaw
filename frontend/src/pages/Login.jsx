import Form from "../components/Form"
import { Link } from "react-router-dom"
import '../styles/Login.css'

function Login() {
    return (
        <div>
            <Form route="/api/token/" method="login"/>
            <div className="register-acc">
                <Link to="/register">Don't you have an account ?</Link>
            </div>
        </div>
    )
}


export default Login