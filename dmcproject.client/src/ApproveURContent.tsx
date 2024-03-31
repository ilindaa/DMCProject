import { Link } from "react-router-dom";
import { FC, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

const Approve: FC = () => {
    useEffect(() => {

        getData();

        const xButton = document.getElementById("xButton");
        xButton.addEventListener("click", function () {
            return hideFormDiv();
        });
        hideFormDiv();

        const approveURContentForm = document.getElementById("approveURContentForm");
        approveURContentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            try {

                const formData = new FormData(approveURContentForm);
                const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
                console.log(jsonData);

                fetch("https://localhost:7035/api/UserRefContent/ReviewURContent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: jsonData
                }).then(response => {
                    console.log(response);
                    return response.text();
                }).then(msg => {
                    console.log(msg);
                    approveURContentForm.reset();
                    hideFormDiv();
                }).catch(error => {
                    console.log(error);
                })
            } catch (error) {
                console.log(error);
            }

            getData();
            console.log("Reviewed!");
        });

    }, []);
    return (<>
        <h1>Approve Content</h1>
        <Link to="../admin-page">Back to Admin</Link>
        <p>Review Column Key: Approve (1), Reject (0), and In Review (-1)</p>
        <div id="tableDiv">
            <Table striped bordered hover id="dataTable">
                <thead>
                    <tr>
                        <th>ReviewURContentID</th>
                        <th>Review</th>
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
        <div id="formDiv">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title id="pReviewId"></Modal.Title>
                    <CloseButton id="xButton" aria-label="Hide" />
                </Modal.Header>
                <Form id="approveURContentForm">
                    <Form.Control type="hidden" id="reviewUrContentId" name="reviewUrContentId" value="-1" />
                    <Form.Group>
                        <Form.Group controlId="approve">
                            <Form.Check type="radio" label="Approve" name="review" value={1} required />
                        </Form.Group>
                        <Form.Group controlId="reject">
                            <Form.Check type="radio" label="Reject" name="review" value={0} />
                        </Form.Group>
                    </Form.Group>
                    <Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form.Group>
                </Form>
            </Modal.Dialog>
        </div>
    </>);
}

function getData() {
    try {
        fetch("https://localhost:7035/api/UserRefContent/GetReviewURContent", {
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
}

function hideFormDiv() {
    const formDiv = document.getElementById("formDiv");
    formDiv.style.display = "none";
}

function showFormDiv() {
    const formDiv = document.getElementById("formDiv");
    formDiv.style.display = "block";
}

function createTable(jsonData: string) {
    const dataObject: MyDataTwo[] = JSON.parse(jsonData);
    const dataTableBody = document.getElementById("dataTableBody");

    clearTable();

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
        const td8 = document.createElement("td");
        const td9 = document.createElement("td");

        const reviewRoot = createRoot(td9);
        const index = dataObject[i]["addURContentID"].toString();
        reviewRoot.render(<Button data-index={index} onClick={() => reviewRow(index)} >Review</Button>);

        td1.innerText = dataObject[i]["reviewURContentID"].toString();
        td2.innerText = dataObject[i]["review"].toString();
        td3.innerText = dataObject[i]["addURContentID"].toString();
        td4.innerText = dataObject[i]["firstName"];
        td5.innerText = dataObject[i]["middleName"];
        td6.innerText = dataObject[i]["lastName"];
        td7.innerText = dataObject[i]["filePath"];
        td8.innerText = dataObject[i]["imageCategory"];

        tr.append(td1, td2, td3, td4, td5, td6, td7, td8, td9);
        td9.appendChild(reviewButton);
    } 
}

function clearTable() {
    const dataTableBody = document.getElementById("dataTableBody");
    dataTableBody.replaceChildren();

    console.log("Cleared!");
}

function reviewRow(index: string) {
    const pReviewId = document.getElementById("pReviewId");
    pReviewId.innerText = "Reviewing ReviewURContentID: " + index;

    const reviewUrContentId = document.getElementById("reviewUrContentId") as HTMLInputElement;
    reviewUrContentId.value = index;

    showFormDiv();
    /*    const pMsg = document.getElementById("pMsg");*/
}

interface MyDataTwo {
    reviewURContentID: number;
    review: number;
    addURContentID: number;
    firstName: string;
    middleName: string;
    lastName: string;
    filePath: string;
    imageCategory: string;
}

function ApproveURContent() {
    return (<>
        <Approve />
    </>);
}

export default ApproveURContent;