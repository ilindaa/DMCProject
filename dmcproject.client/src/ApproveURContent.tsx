import { Link } from "react-router-dom";
import { FC, useEffect } from "react";

const Approve: FC = () => {
    useEffect(() => {

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

    }, []);
    return (<>
        <h1>Approve Content</h1>
        <Link to="../admin-page">Back to Admin</Link>
    </>);
}

function createTable(jsonData: string) {
    const dataObject: MyData[] = JSON.parse(jsonData);
    const dataTableBody = document.getElementById("dataTableBody");

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

        td1.innerText = dataObject[i]["addURContentID"].toString();
        td2.innerText = dataObject[i]["firstName"];
        td3.innerText = dataObject[i]["middleName"];
        td4.innerText = dataObject[i]["lastName"];
        td5.innerText = dataObject[i]["filePath"];
        td6.innerText = dataObject[i]["imageCategory"];

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
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

function ApproveURContent() {
    return (<>
        <Approve />
        <div id="tableDiv">
            <table id="dataTable">
                <tbody id="dataTableBody">
                    <tr>
                        <th>AddURContentID</th>
                        <th>FirstName</th>
                        <th>MiddleName</th>
                        <th>LastName</th>
                        <th>FilePath</th>
                        <th>ImageCategory</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </>);
}

export default ApproveURContent;