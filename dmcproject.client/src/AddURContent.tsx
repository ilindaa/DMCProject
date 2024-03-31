import { Link } from "react-router-dom";
import { FC, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AddURContentForm: FC = () => {
    // useEffect gets called after the fragment loads on the page
    useEffect(() => {
        const addURContentForm = document.getElementById("addURContentForm");
        const pMsg = document.getElementById("pMsg");

        // FileReader to read in the image and then add it to the formData and is with the jsonData
        const fileInput = document.getElementById("uploadImage");
        let result = null;

        // Runs each time the fileInput changes
        fileInput.addEventListener("change", function (event) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function () {
                result = reader.result;
                console.log(result);
            };
            reader.readAsDataURL(file);
        });

        addURContentForm.addEventListener("submit", function (event) {
            // Stops the page from refreshing
            event.preventDefault();

            // Store the form data as a FormData object then turn it into a string (JsonElement)
            const formData = new FormData(addURContentForm);
            formData.set("uploadImage", result);
            console.log("formData: " + formData);

            const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
            console.log(jsonData);
            // Fetch the data to the server and send it to be handled in UserRefContentController.cs
            try {
                fetch("https://localhost:7035/api/UserRefContent/AddURContent", {
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
                    addURContentForm.reset();
                })
            } catch (error) {
                console.log(error);
            }
            console.log("Submitted!");
        })
    }, []);

    return (
        <>
            <Link to="/">Back</Link>
            {/* Temporary line break and plan to make this conditional rendering here (depending on if logged in as an admin or user) */}
            <br />
            <Link to="../admin-page">Back to Admin</Link>
            <p>Please fill out the correct information about the <strong>original owner of the image</strong>. Then upload the image or provide a URL link to the image. <strong><u>All submissions are moderated</u></strong>.</p>
            <Form id="addURContentForm">
                <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name="firstName" maxLength={25} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="middleName">
                    <Form.Label>Middle Name</Form.Label>
                    <Form.Control type="text" name="middleName" maxLength={25} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name="lastName" maxLength={25} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="uploadImage">
                    <Form.Label>Upload an Image</Form.Label>
                    <Form.Control type="file" name="uploadImage" accept=".png, .jpeg, .jpg" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Category of Image</Form.Label>
                    <Form.Select name="category" aria-label="Select a category" required>
                        <option value="Figure">Figure</option>
                        <option value="Hands">Hands</option>
                        <option value="Feet">Feet</option>
                        <option value="Portraits">Portraits</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="checkCredit">
                    <Form.Check name="checkCredit" label="By uploading the image, you certify that you have provided the correct information to credit the original owner of the image.
                        You also certify that you are either the original owner of the image or you have received explicit permission to upload the image." aria-label="check credit" required />
                </Form.Group>

                <Form.Group>
                    <Button type="submit">Upload</Button>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Text id="pMsg"></Form.Text>
                </Form.Group>
            </Form>
        </>
    );
}

function AddURContent() {
    return (
        <AddURContentForm />
  );
}

export default AddURContent;