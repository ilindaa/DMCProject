import { Link } from "react-router-dom";

const Register = () => {
    return (
        <>
            <h1>Register</h1>
            <Link to="/">Back</Link>
            <div>
                <form action="../../DMCProject.Server/Program.cs" method="post" id="registerForm">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" required></input>

                    <label htmlFor="password">Password</label>
                    <input type="text" id="password" name="password" required></input>

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="text" id="confirmPassword" name="confirmPassword" required></input>

                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    )
}

export default Register;