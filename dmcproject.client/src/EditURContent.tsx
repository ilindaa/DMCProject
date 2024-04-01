import { FC, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

const Edit: FC = () => {
    useEffect(() => {

        getData();

        const xButton = document.getElementById("xButton");
        xButton.addEventListener("click", function () {
            return hideFormDiv();
        });
        hideFormDiv();

        const editURContentForm = document.getElementById("editURContentForm");
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

        editURContentForm.addEventListener("submit", function (event) {
            // Stops the page from refreshing
            event.preventDefault();

            // Store the form data as a FormData object then turn it into a string (JsonElement)
            const formData = new FormData(editURContentForm);
            formData.set("uploadImage", result);

            const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
            console.log("jsonData: " + jsonData);

            // Fetch the data to the server and send it to be handled in UserRefContentController.cs
            try {
                fetch("https://localhost:7035/api/UserRefContent/EditURContent", {
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
                    editURContentForm.reset();
                    hideFormDiv();
                })
            } catch (error) {
                console.log(error);
            }
            console.log("Submitted!");
        })
    }, []);
    return (<>
        <h1>Edit Content</h1>
        <div id="tableDiv">
            <Table striped bordered hover id="dataTable">
                <thead>
                    <tr>
                        <th>AddURContentID</th>
                        <th>FirstName</th>
                        <th>MiddleName</th>
                        <th>LastName</th>
                        <th>FilePath</th>
                        <th>ImageCategory</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="dataTableBody">
                </tbody>
            </Table>
        </div>
        <div className="centerDiv">
        <div id="formDiv" className="formSize">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title id="pAddId"></Modal.Title>
                    <CloseButton id="xButton" aria-label="Hide"/>
                </Modal.Header>
                <Form id="editURContentForm">
                    <Form.Control type="hidden" id="addUrContentId" name="addUrContentId" value="-1" />
                    <Form.Control type="hidden" id="filePath" name="filePath" value="N/A" />

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
                        <Form.Select name="category" aria-label="Select a Category" required>
                            <option value="Figure">Figure</option>
                            <option value="Hands">Hands</option>
                            <option value="Feet">Feet</option>
                            <option value="Portraits">Portraits</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Button type="submit" className="w-100">Submit</Button>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Text id="pMsg"></Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Dialog>
            </div>
        </div>
    </>);
}

function getData() {
    try {
        fetch("https://localhost:7035/api/UserRefContent/GetAddURContent", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => {
            console.log(response);
            return response.text();
        }).then(jsonData => {
            createTable(jsonData);
            console.log(jsonData);
        }).catch(error => {
            console.log(error);
        })
    } catch (error) {
        console.log(error);
    }

    console.log("Displayed!");
}

function hideFormDiv() {
    const formDiv = document.getElementById("formDiv");
    formDiv.style.display = "none";
}

function showFormDiv() {
    const formDiv = document.getElementById("formDiv");
    formDiv.style.display = "block";
}

// WIP: Need to add the uploadImage part
function fillForm(dataObject: MyData[], rowIndex: number, index: string) {
    const addUrContentId = document.getElementById("addUrContentId") as HTMLInputElement;
    const filePath = document.getElementById("filePath") as HTMLInputElement;
    const firstName = document.getElementById("firstName") as HTMLInputElement;
    const middleName = document.getElementById("middleName") as HTMLInputElement;
    const lastName = document.getElementById("lastName") as HTMLInputElement;
/*    const uploadImage = document.getElementById("uploadImage") as HTMLInputElement;*/
    const category = document.getElementById("category") as HTMLInputElement;

    addUrContentId.value = index;
    filePath.value = dataObject[rowIndex]["filePath"];
    firstName.value = dataObject[rowIndex]["firstName"];
    middleName.value = dataObject[rowIndex]["middleName"];
    lastName.value = dataObject[rowIndex]["lastName"];
    // uploadImage
    category.value = dataObject[rowIndex]["imageCategory"];
}

function createTable(jsonData: string) {
    const dataObject: MyData[] = JSON.parse(jsonData);
    const dataTableBody = document.getElementById("dataTableBody");

    clearTable();

    /*    const columnLength = Object.keys(dataObject).length;*/
    /*  console.log(dataObject[0]["addURContentID"]);*/
    for (let i = 0; i < dataObject.length; i++) {
        const tr = document.createElement("tr");
        dataTableBody.appendChild(tr);

        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");
        const td7 = document.createElement("td");

        const editRoot = createRoot(td7);
        const index = dataObject[i]["addURContentID"].toString();
        editRoot.render(<Button className="w-100" data-index={index} onClick={() => editRow(dataObject, i, index)} >Edit</Button>);

        td1.innerText = dataObject[i]["addURContentID"].toString();
        td2.innerText = dataObject[i]["firstName"];
        td3.innerText = dataObject[i]["middleName"];
        td4.innerText = dataObject[i]["lastName"];
        td5.innerText = dataObject[i]["filePath"];
        td6.innerText = dataObject[i]["imageCategory"];

        tr.append(td1, td2, td3, td4, td5, td6, td7);
    }
}

function clearTable() {
    const dataTableBody = document.getElementById("dataTableBody");
    dataTableBody.replaceChildren();

    console.log("Cleared!");
}

function editRow(dataObject: MyData[], rowIndex: number, index: string) {
    const editURContentForm = document.getElementById("editURContentForm");
    const pAddId = document.getElementById("pAddId");
    pAddId.innerText = "Editing AddURContentID: " + index;

    console.log(editURContentForm);
    console.log("Edit, index: " + index);
    fillForm(dataObject, rowIndex, index);
    showFormDiv();
}

interface MyData {
    addURContentID: number;
    firstName: string;
    middleName: string;
    lastName: string;
    filePath: string;
    imageCategory: string;
}
function EditURContent() {
    return (<>
        <Edit />
    </>);
}

export default EditURContent;