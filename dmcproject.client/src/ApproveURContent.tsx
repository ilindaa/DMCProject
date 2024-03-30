import { Link } from "react-router-dom";
import { FC, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';

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
            <table id="dataTable">
                <tbody id="dataTableBody">
                </tbody>
            </table>
        </div>
        <div id="formDiv">
            <CloseButton id="xButton" />
            <Form id="approveURContentForm">
                <Form.Text id="pReviewId"></Form.Text>
                <Form.Control type="hidden" id="reviewUrContentId" name="reviewUrContentId" value="-1" />
                <Form.Group>
                    <Form.Group controlId="approve">
                        <Form.Check type="radio" name="review" value={1} required />
                        <Form.Label>Approve</Form.Label>
                    </Form.Group>
                    <Form.Group controlId="reject">
                        <Form.Check type="radio" name="review" value={0} />
                        <Form.Label>Reject</Form.Label>
                    </Form.Group>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">Submit</Button>
                </Form.Group>
            </Form>
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
        const td8 = document.createElement("td");
        const td9 = document.createElement("td");
        const reviewButton = document.createElement("button");
        reviewButton.innerText = "Review";
        reviewButton.dataset.index = dataObject[i]["reviewURContentID"].toString();
        reviewButton.addEventListener("click", function () {
            return reviewRow(reviewButton.dataset.index as string);
        });

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

    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    const th3 = document.createElement("th");
    const th4 = document.createElement("th");
    const th5 = document.createElement("th");
    const th6 = document.createElement("th");
    const th7 = document.createElement("th");
    const th8 = document.createElement("th");
    const th9 = document.createElement("th");
    th1.innerText = "ReviewURContentID";
    th2.innerText = "Review";
    th3.innerText = "AddURContentID";
    th4.innerText = "FirstName";
    th5.innerText = "MiddleName";
    th6.innerText = "LastName";
    th7.innerText = "FilePath";
    th8.innerText = "ImageCategory";

    dataTableBody.appendChild(tr);
    tr.append(th1, th2, th3, th4, th5, th6, th7, th8, th9);

    console.log("Cleared!");
}

function reviewRow(index: string) {
    const pReviewId = document.getElementById("pReviewId");
    pReviewId.innerText = "ReviewURContentID: " + index + " is currently in review.";

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