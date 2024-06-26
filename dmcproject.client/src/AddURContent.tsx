import { FC, useEffect } from "react";
import AlertDismissible from "./alerts.tsx";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AddURContentForm: FC = () => {
    // useEffect gets called after the fragment loads on the page
    useEffect(() => {
        const addURContentForm = document.getElementById("addURContentForm");
        const alertNotif = document.getElementById("alertNotif");
        const pMsg = document.getElementById("pMsg");

        alertNotif.style.display = "none";

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
                    alertNotif.style.display = "block";
                    pMsg.innerText = msg;
                    if (pMsg.innerText.includes("Error:")) {
                        alertNotif.classList.remove("alert-success");
                        alertNotif.classList.add("alert-danger");
                    } else {
                        alertNotif.classList.remove("alert-danger");
                        alertNotif.classList.add("alert-success");
                    }
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
            <AlertDismissible variant="success" message="" />
            <h1 className="underNav">Add Content</h1>
            <div className="centerDiv columnDiv">
                <p>Please fill out the correct information about the <strong>original owner of the image</strong>.{/*<br />Then upload the image or provide a URL link to the image.*/}<br /><strong><u>All submissions will be moderated</u></strong>.</p>
                <div className="formSize">
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
                            {/* Select Update: AddURContent.tsx, EditURContent.tsx, App.tsx */}
                            <Form.Select name="category" aria-label="Select a category" required>
                                <optgroup label="Human Anatomy">
                                    <option value="Human Eyes">Eyes</option>
                                    <option value="Human Feet">Feet</option>
                                    <option value="Human Hands">Hands</option>
                                    <option value="Human Body Pose">Body Pose</option>
                                    <option value="Human Face Expressions">Face Expressions</option>
                                    <option value="Human Hair">Hair</option>
                                    <option value="Human Portraits">Portraits</option>
                                </optgroup>
                                <optgroup label="Backgrounds">
                                    <option value="Beach">Beach</option>
                                    <option value="Buildings">Buildings</option>
                                    <option value="Forest">Forest</option>
                                    <option value="Landscapes">Landscapes</option>
                                    <option value="Medieval">Medieval</option>
                                    <option value="Mountain">Mountain</option>
                                    <option value="Sky">Sky</option>
                                    <option value="Skyscrapers">Skyscrapers</option>
                                    <option value="Space">Space</option>
                                    <option value="Underwater">Underwater</option>
                                </optgroup>
                                <optgroup label="Still Life">
                                    <option value="Action Figure">Action Figure</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Fabrics">Fabrics</option>
                                    <option value="Food">Food</option>
                                    <option value="Flowers">Flowers</option>
                                    <option value="Instruments">Instruments</option>
                                    <option value="Objects">Objects</option>
                                    <option value="Paintings">Paintings</option>
                                    <option value="Sculptures">Sculptures</option>
                                    <option value="Shapes">Shapes</option>
                                </optgroup>
                                <optgroup label="Art Concepts">
                                    <option value="Black and White">Black and White</option>
                                    <option value="Color">Color</option>
                                    <option value="Composition">Composition</option>
                                    <option value="Design">Design</option>
                                    <option value="Dramatic Lighting">Dramatic Lighting</option>
                                    <option value="Illustration">Illustration</option>
                                    <option value="Perspective">Perspective</option>
                                </optgroup>
                                <optgroup label="Animals">
                                    <option value="Animals">Animals</option>
                                    <option value="Amphibians">Amphibians</option>
                                    <option value="Birds">Birds</option>
                                    <option value="Bugs">Bugs</option>
                                    <option value="Fish">Fish</option>
                                    <option value="Mammals">Mammals</option>
                                    <option value="Reptiles">Reptiles</option>
                                </optgroup>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="checkCredit">
                            <Form.Check name="checkCredit" label="By uploading the image, you certify that you have provided the correct information to credit the original owner of the image.
                                You also certify that you are either the original owner of the image or you have received explicit permission to upload the image." aria-label="check credit" required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Button type="submit" className="w-100">Upload</Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </>
    );
}

function AddURContent() {
    return (
        <main className="root">
            <AddURContentForm />
        </main>
  );
}

export default AddURContent;