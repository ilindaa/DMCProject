import { Link } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
    useEffect(() => {
        const registerForm = document.getElementById("registerForm");
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const formData = new FormData(registerForm);
            console.log(formData);
            try {
                fetch("https://localhost:7035/api/Account/Register", {
                    method: "POST",
                    body: formData
                }).then(response => {
                    console.log(response);
                })
            } catch(error) {
                console.log(error);
            }
            console.log("Submitted!");
        })
    }, []);

    return (
        <>
            <h1>Register</h1>
            <Link to="/">Back</Link>
            <div>
                <form id="registerForm">
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