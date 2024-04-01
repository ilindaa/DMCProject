import { Link } from "react-router-dom";
import { FC, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const LoginForm: FC = () => {
    // useEffect gets called after the fragment loads on the page
    useEffect(() => {
        const loginForm = document.getElementById("loginForm");
        const pMsg = document.getElementById("pMsg");

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
                    return response.text();
                }).then(msg => {
                    pMsg.innerText = msg;
                    loginForm.reset();
                })
            } catch (error) {
                console.log(error);
            }
            console.log("Submitted!");
        })
    }, []);

    return (
        <>
            <div className="centerDiv">
                <div className="formSize">
                    <Form id="loginForm">
                        <h1> Login</h1>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" maxLength={50} placeholder="name@example.com" required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" minLength={8} maxLength={30} placeholder="Password" required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Button variant="primary" type="submit" className="w-100">Log In</Button>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Text id="pMsg"></Form.Text>
                        </Form.Group>

                        <p>Don't have an account? <Link to="../sign-up">Sign Up</Link>.</p>
                    </Form>
                </div>
            </div>
        </>
    );

}

function Login() {
    return (
        <>
            <LoginForm />
        </>
    );
};

export default Login;