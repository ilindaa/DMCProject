import { Link } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
    // useEffect gets called after the fragment loads on the page
    useEffect(() => {
        const registerForm = document.getElementById("registerForm");

        registerForm.addEventListener("submit", function (event) {
            // Stops the page from refreshing
            event.preventDefault();
            // Store the form data as a FormData object then turn it into a string (JsonElement)
            const formData = new FormData(registerForm);
            const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
            console.log(jsonData);
            // Fetch the data to the server and send it to be handled in AccountController.cs
            try {
                fetch("https://localhost:7035/api/Account/Register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: jsonData
                }).then(response => {
                    console.log(response);
                })
            } catch(error) {
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
            <h1>Register</h1>
            <Link to="/">Back</Link>
            <div>
                <form id="registerForm">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" maxLength={50} required></input>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" minLength={8} maxLength={30} required></input>

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" minLength={8} maxLength={30} required></input>

                    <button type="submit">Register</button>
                </form>
            </div>
            <p>Have an account? <Link to="../login">Login</Link>.</p>
        </>
)
}

export default Register;