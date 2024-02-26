/*import React from 'react';*/
import { Link } from "react-router-dom";
import { FC } from "react";

const AddURContentForm: FC = () => {

    return (
        <>
            <Link to="/">Back</Link>
            <p>Please fill out the correct information about the <strong>original owner of the image</strong>. Then upload the image or provide a URL link to the image. <strong><u>All submissions are moderated</u></strong>.</p>
            <form>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" required></input>

                <br></br> {/* temporary */}

                <label htmlFor="middleName">Middle Name</label>
                <input type="text" id="middleName" name="middleName" maxLength={4}></input>

                <br></br> {/* temporary */}

                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" required></input>

                <br></br> {/* temporary */}

                <label htmlFor="uploadImage">Upload an Image</label>
                <input type="file" id="uploadImage" name="uploadImage" accept=".png, .jpeg, .jpg"></input>

                <br></br> {/* temporary */}
                <label htmlFor="urlLinkImage">Image URL Link</label>
                <input type="url" id="urlLinkImage" name="urlLinkImage"></input>

                <br></br> {/* temporary */}
                <label htmlFor="category" id="category">Category of Image</label>
                <select name="category" required>
                    <option value="humanFigure">Figure</option>
                    <option value="hands">Hands</option>
                    <option value="feet">Feet</option>
                    <option value="portraits">Portraits</option>
                </select>

                <br></br> {/* temporary */}

                <input type="checkbox" id="checkCredit" name="checkCredit" required></input>
                <label htmlFor="checkCredit">By uploading the image, you certify that you have provided the correct information to credit the original owner of the image.<br></br>You also certify that you are either the original owner of the image or you have received explicit permission to upload the image.</label>

                <br></br> {/* temporary */}

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