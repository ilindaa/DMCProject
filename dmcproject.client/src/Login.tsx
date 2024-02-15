import { Link } from "react-router-dom";

const Login = () => {
    return (
        <>
            <h1>Login</h1>
            <Link to="/">Back</Link>
            <div>
                <form action="../../DMCProject.Server/Program.cs" method="post" id="loginForm">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" required></input>

                    <label htmlFor="password">Password</label>
                    <input type="text" id="password" name="password" required></input>

                    <button type="submit">Log In</button>
                </form>
            </div>
            <p>Don't have an account? <Link to="register">Register</Link>!</p>
        </>
    );
};

export default Login;