import { FC, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import AlertDismissible from "./alerts.tsx";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import TopButton from './topButton.tsx';

const Delete: FC = () => {
    useEffect(() => {

        getData();

        const alertNotif = document.getElementById("alertNotif");
        alertNotif.style.display = "none";

    }, []);
    return (<>
        <AlertDismissible variant="success" message="" />
        <h1 className="underNav">Delete Content</h1>
        <div id="tableDiv">
            <Table striped bordered hover id="dataTable">
                <thead>
                    <tr>
{/*                        <th>AddURContentID</th>*/}
                        <th></th>
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
function createTable(jsonData: string) {
    const dataObject: MyData[] = JSON.parse(jsonData);
    const dataTableBody = document.getElementById("dataTableBody");

    clearTable();

    /*    const columnLength = Object.keys(dataObject).length;*/
    /*  console.log(dataObject[0]["addURContentID"]);*/
    for (let i = 0; i < dataObject.length; i++) {
        const tr = document.createElement("tr");
        dataTableBody.appendChild(tr);

/*        const td1 = document.createElement("td");*/
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");
        const td7 = document.createElement("td");

        const deleteRoot = createRoot(td7);
        const index = dataObject[i]["addURContentID"].toString();
        deleteRoot.render(<Button className="w-100" data-index={ index } onClick={ () => deleteRow(index) } >Delete</Button>);

        const img = document.createElement("img");
        img.classList.add("admin-img");
        img.src = "https://localhost:7035/" + dataObject[i]["filePath"].toString();
        const a = document.createElement("a");
        a.href = img.src;
        a.target = "_blank";

/*        td1.innerText = dataObject[i]["addURContentID"].toString();*/
        td2.innerText = dataObject[i]["firstName"];
        td3.innerText = dataObject[i]["middleName"];
        td4.innerText = dataObject[i]["lastName"];
        td6.innerText = dataObject[i]["imageCategory"];

        tr.append(/*td1,*/ td7, td2, td3, td4, td5, td6);
        td5.append(a);
        a.append(img);
    }
}

function clearTable() {
    const dataTableBody = document.getElementById("dataTableBody");
    dataTableBody.replaceChildren();

    console.log("Cleared!");
}

function deleteRow(index: string) {
    const del = confirm("Are you sure you want to delete the following AddURContentID? \nAddURContentID: " + index + "\nNote: This action cannot be undone.");
    if (del) {
        const jsonData = JSON.stringify(index);
        const alertNotif = document.getElementById("alertNotif");
        const pMsg = document.getElementById("pMsg");

        try {
            fetch("https://localhost:7035/api/UserRefContent/DeleteURContent", {
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
            }).catch(error => {
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }

        getData();
        console.log("Deleted!");
    }
}
interface MyData {
    addURContentID: number;
    firstName: string;
    middleName: string;
    lastName: string;
    filePath: string;
    imageCategory: string;
}

function DeleteURContent() {
    return (<main className="root">
        <Delete />
        <TopButton />
    </main>);
}

export default DeleteURContent;