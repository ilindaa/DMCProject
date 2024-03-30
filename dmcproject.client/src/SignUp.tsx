import { Link } from "react-router-dom";
import { FC, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SignUpForm: FC = () => {
    // useEffect gets called after the fragment loads on the page
    useEffect(() => {
        const signUpForm = document.getElementById("signUpForm");
        const pMsg = document.getElementById("pMsg");

        signUpForm.addEventListener("submit", function (event) {
            // Stops the page from refreshing
            event.preventDefault();
            // Store the form data as a FormData object then turn it into a string (JsonElement)
            const formData = new FormData(signUpForm);
            const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
            console.log(jsonData);
            // Fetch the data to the server and send it to be handled in AccountController.cs
            try {
                fetch("https://localhost:7035/api/Account/SignUp", {
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
                    signUpForm.reset();
                })
            } catch (error) {
                console.log(error);
            }
            console.log("Submitted!");
        })

        // Custom Validity for checking if the password inputs match
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        confirmPassword.addEventListener("focusout", function () {
            if (password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity("Error: The passwords inputted do not match!");
            } else {
                confirmPassword.setCustomValidity("");
            }

        });
    }, []);

    return (
        <>
            <h1>Sign Up</h1>
            <Link to="/">Back</Link>
            <div>
                <Form id="signUpForm">
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" maxLength={50} placeholder="name@example.com" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" minLength={8} maxLength={30} placeholder="Password" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" name="confirmPassword" minLength={8} maxLength={30} placeholder="Confirm Password" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Button variant="primary" type="submit">Sign Up</Button>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Text id="pMsg"></Form.Text>
                    </Form.Group>
                </Form>
            </div>
            <p>Have an account? <Link to="../login">Login</Link>.</p>
        </>
    );

}

function SignUp() {
    return (
        <>
            <SignUpForm />
        </>
)
}

export default SignUp;