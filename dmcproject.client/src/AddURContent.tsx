import { Link } from "react-router-dom";
import { FC, useEffect } from "react";

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
            <p>Please fill out the correct information about the <strong>original owner of the image</strong>. Then upload the image or provide a URL link to the image. <strong><u>All submissions are moderated</u></strong>.</p>
            <form id="addURContentForm">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" maxLength={25} required></input>

                <br></br> {/* temporary */}

                <label htmlFor="middleName">Middle Name</label>
                <input type="text" id="middleName" name="middleName" maxLength={25}></input>

                <br></br> {/* temporary */}

                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" maxLength={25} required></input>

                <br></br> {/* temporary */}

                <label htmlFor="uploadImage">Upload an Image</label>
                <input type="file" id="uploadImage" name="uploadImage" accept=".png, .jpeg, .jpg"></input>

{/*                <br></br> */}{/* temporary */}{/*
                <label htmlFor="urlLinkImage">Image URL Link</label>
                <input type="url" id="urlLinkImage" name="urlLinkImage" maxLength={50}></input>*/}

                <br></br> {/* temporary */}
                <label htmlFor="category" id="category">Category of Image</label>
                <select name="category" required>
                    <option value="Figure">Figure</option>
                    <option value="Hands">Hands</option>
                    <option value="Feet">Feet</option>
                    <option value="Portraits">Portraits</option>
                </select>

                <br></br> {/* temporary */}

                <input type="checkbox" id="checkCredit" name="checkCredit" required></input>
                <label htmlFor="checkCredit">By uploading the image, you certify that you have provided the correct information to credit the original owner of the image.<br></br>You also certify that you are either the original owner of the image or you have received explicit permission to upload the image.</label>

                <br></br> {/* temporary */}
                <p id="pMsg"></p>

                <button type="submit">Upload</button>
            </form>
        </>
    );
}

function AddURContent() {
    return (
        <AddURContentForm />
  );
}

export default AddURContent;