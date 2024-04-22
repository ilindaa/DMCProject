import { FC, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import AlertDismissible from "./alerts.tsx";
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import TopButton from './topButton.tsx';

const Approve: FC = () => {
    useEffect(() => {

        getData();

        const alertNotif = document.getElementById("alertNotif");
        const pMsg = document.getElementById("pMsg");

        alertNotif.style.display = "none";

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
                    alertNotif.style.display = "block";
                    pMsg.innerText = msg;
                    if (pMsg.innerText.includes("Error:")) {
                        alertNotif.classList.remove("alert-success");
                        alertNotif.classList.add("alert-danger");
                    } else {
                        alertNotif.classList.remove("alert-danger");
                        alertNotif.classList.add("alert-success");
                    }
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
        <AlertDismissible variant="success" message="" />
        <h1 className="underNav">Approve Content</h1>
        <div id="tableDiv">
            <Table striped bordered hover id="dataTable">
                <thead>
                    <tr>
{/*                        <th>ReviewURContentID</th>*/}
                        <th></th>
                        <th>Review Status</th>
{/*                        <th>AddURContentID</th>*/}
                        <th>First Name</th>
                        <th>Middle Name</th>
                        <th>Last Name</th>
                        <th>Image</th>
                        <th>Image Category</th>
                    </tr>
                </thead>
                <tbody id="dataTableBody">
                </tbody>
            </Table>
        </div>
        <div className="centerDiv">
            <div id="formDiv" className="formSize centerApproveEdit">
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title id="pReviewId"></Modal.Title>
                        <CloseButton id="xButton" className="float-right" aria-label="Hide" />
                    </Modal.Header>
                    <Form id="approveURContentForm">
                        <Form.Control type="hidden" id="reviewUrContentId" name="reviewUrContentId" value="-1" />
                        <Form.Group className="mb-3">
                            <Form.Group controlId="approve">
                                <Form.Check type="radio" label="Approve" name="review" value={1} defaultChecked required />
                            </Form.Group>
                            <Form.Group controlId="reject">
                                <Form.Check type="radio" label="Reject" name="review" value={0} />
                            </Form.Group>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Button type="submit" className="w-100">Submit</Button>
                        </Form.Group>
                    </Form>
                </Modal.Dialog>
            </div>
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

/*        const td1 = document.createElement("td");*/
        const td2 = document.createElement("td");
/*        const td3 = document.createElement("td");*/
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");
        const td7 = document.createElement("td");
        const td8 = document.createElement("td");
        const td9 = document.createElement("td");

        const reviewRoot = createRoot(td9);
        const index = dataObject[i]["addURContentID"].toString();
        reviewRoot.render(<Button className="w-100" data-index={index} onClick={() => reviewRow(index)} >Review</Button>);

        const img = document.createElement("img");
        img.classList.add("admin-img");
        img.src = "https://localhost:7035/" + dataObject[i]["filePath"].toString();
        const a = document.createElement("a");
        a.href = img.src;
        a.target = "_blank";

/*        td1.innerText = dataObject[i]["reviewURContentID"].toString();*/
        /* If the review status is 1 then it's approved, 0 then it's rejected, and -1 then it's in review */
        if (dataObject[i]["review"].toString() == "1") {
            td2.innerText = "Approved";
        } else if (dataObject[i]["review"].toString() == "0") {
            td2.innerText = "Rejected";
        } else {
            td2.innerText = "In Review";
        }
/*        td3.innerText = dataObject[i]["addURContentID"].toString();*/
        td4.innerText = dataObject[i]["firstName"];
        td5.innerText = dataObject[i]["middleName"];
        td6.innerText = dataObject[i]["lastName"];
        td8.innerText = dataObject[i]["imageCategory"];

        tr.append(/*td1,*/ td9, td2, /*td3,*/ td4, td5, td6, td7, td8);
        td7.append(a);
        a.append(img);
    } 
}

function clearTable() {
    const dataTableBody = document.getElementById("dataTableBody");
    dataTableBody.replaceChildren();

    console.log("Cleared!");
}

function reviewRow(index: string) {
    hideFormDiv();

    const pReviewId = document.getElementById("pReviewId");
    pReviewId.innerText = "Reviewing ReviewURContentID: " + index;

    const reviewUrContentId = document.getElementById("reviewUrContentId") as HTMLInputElement;
    reviewUrContentId.value = index;

    setFormPosition(index);
    showFormDiv();
}

function setFormPosition(index: string) {
    const button = document.querySelector("[data-index='" + index + "']") as HTMLButtonElement;
    const buttonPosition = button.getBoundingClientRect();
    const form = document.querySelector(".centerApproveEdit") as HTMLElement;

    form.style.top = buttonPosition.bottom + 'px';
    form.style.left = buttonPosition.left + 'px';
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
    return (<main className="root">
        <Approve />
        <TopButton />
    </main>);
}

export default ApproveURContent;