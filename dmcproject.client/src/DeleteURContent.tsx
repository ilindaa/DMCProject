import { Link } from "react-router-dom";
import { FC, useEffect } from "react";

const Delete: FC = () => {
    useEffect(() => {

        getData();

    }, []);
    return (<>
        <h1>Delete Content</h1>
        <Link to="../admin-page">Back to Admin</Link>
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

        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");
        const td7 = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.dataset.index = dataObject[i]["addURContentID"].toString();
        deleteButton.addEventListener("click", function () {
            return deleteRow(deleteButton.dataset.index as string);
        });

        td1.innerText = dataObject[i]["addURContentID"].toString();
        td2.innerText = dataObject[i]["firstName"];
        td3.innerText = dataObject[i]["middleName"];
        td4.innerText = dataObject[i]["lastName"];
        td5.innerText = dataObject[i]["filePath"];
        td6.innerText = dataObject[i]["imageCategory"];

        tr.append(td1, td2, td3, td4, td5, td6, td7);
        td7.appendChild(deleteButton);
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
    th1.innerText = "AddURContentID";
    th2.innerText = "FirstName";
    th3.innerText = "MiddleName";
    th4.innerText = "LastName";
    th5.innerText = "FilePath";
    th6.innerText = "ImageCategory";

    dataTableBody.appendChild(tr);
    tr.append(th1, th2, th3, th4, th5, th6, th7);

    console.log("Cleared!");
}

function deleteRow(index: string) {
    const del = confirm("Are you sure you want to delete AddURContentID: \"" + index + "\"? \nNote: This action cannot be undone.");
    if (del) {
        const jsonData = JSON.stringify(index);
        /*    const pMsg = document.getElementById("pMsg");*/

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
                console.log(msg);
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
    return (<>
        <Delete />
        <div id="tableDiv">
            <table id="dataTable">
                <tbody id="dataTableBody">
                </tbody>
            </table>
        </div>
    </>);
}

export default DeleteURContent;