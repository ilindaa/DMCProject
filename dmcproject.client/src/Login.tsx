import { Link } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
    // useEffect gets called after the fragment loads on the page
    useEffect(() => {
        const loginForm = document.getElementById("loginForm");

        loginForm.addEventListener("submit", function (event) {
            // Stops the page from refreshing
            event.preventDefault();
            // Store the form data as a FormData object then turn it into a string (JsonElement)
            const formData = new FormData(loginForm);
            const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
            console.log(jsonData);
            // Fetch the data to the server and send it to be handled in AccountController.cs
            try {
                fetch("https://localhost:7035/api/Account/Login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: jsonData
                }).then(response => {
                    console.log(response);
                })
            } catch (error) {
                console.log(error);
            }
            console.log("Submitted!");
        })
    }, []);

    return (
        <>
            <h1>Login</h1>
            <Link to="/">Back</Link>
            <div>
                <form id="loginForm">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" maxLength={50} required></input>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" minLength={8} maxLength={30} required></input>

                    <button type="submit">Log In</button>
                </form>
            </div>
            <p>Don't have an account? <Link to="../register">Register</Link>.</p>
        </>
    );
};

export default Login;