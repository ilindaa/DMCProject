import { Link } from "react-router-dom";

const Login = () => {
    return (
        <>
            <h1>Login</h1>
            <Link to="/">Back</Link>
            <div>
                <form id="loginForm">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" required></input>

                    <label htmlFor="password">Password</label>
                    <input type="text" id="password" required></input>

                    <button type="submit">Log In</button>
                </form>
            </div>
        </>
    );
};

export default Login;