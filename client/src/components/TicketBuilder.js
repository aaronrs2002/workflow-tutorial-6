import React, { useState, useEffect } from "react";
import axios from "axios";
import timestamp from "./timestamp";
import Validate from "./Validate";
import TicketList from "./TicketList";
import DateSelector from "./DateSelector";



const TicketBuilder = (props) => {
    let [func, setFunc] = useState("add");
    let [loaded, setLoaded] = useState(false);
    let [confirm, setConfirm] = useState("");


    const resetFunction = (whatFunc) => {
        [].forEach.call(document.querySelectorAll("select"), (e) => {
            e.selectedIndex = 0;
        });
        setFunc((func) => whatFunc);
        if (document.querySelector("[name='ticketTitle']") && document.querySelector("[name='ticketInfo']")) {
            document.querySelector("[name='ticketTitle']").value = "";
            document.querySelector("[name='ticketInfo']").value = "";
            document.querySelector("[name='assignedTo']").value = "";
        }
    }


    const populateFields = () => {
        let whichTicket = document.querySelector("[name='ticketList']").value;
        if (whichTicket === "default") {
            props.setActiveTicket((activeTicket) => null);
            return false;
        }
        props.setActiveTicket((activeTicket) => whichTicket);

        axios.get("api/tickets/grab-ticket/" + whichTicket, props.config).then(
            (res) => {


                document.querySelector("[name='ticketTitle']").value = res.data[0].ticketId;
                document.querySelector("[name='ticketInfo']").value = res.data[0].ticketInfo;
                document.querySelector("[name='priority']").value = res.data[0].priority;
                document.querySelector("[name='bugNewFeature']").value = res.data[0].bugNewFeature;
                document.querySelector("[name='assignedTo']").value = res.data[0].assignedTo;
                console.log("res.data.dueDate: " + res.data[0].dueDate);
                console.log("res.data[0].dueDate.substring(6, 8): " + res.data[0].dueDate.substring(6, 8));
                console.log(" res.data[0].dueDate.substring(9, 10): " + res.data[0].dueDate.substring(9, 10));
                document.querySelector("[name='due-select-year']").value = res.data[0].dueDate.substring(0, 4);
                document.querySelector("[name='due-select-month']").value = res.data[0].dueDate.substring(5, 7);
                document.querySelector("[name='due-select-day']").value = res.data[0].dueDate.substring(8, 10);


                props.getMessages(whichTicket);

            }, (error) => {
                props.showAlert("That didn't work", "danger");
            }
        )
    }

    const addTicket = () => {
        Validate(["ticketTitle", "ticketInfo", "priority", "bugNewFeature", "assignedTo", "due-select-year", "due-select-month", "due-select-day"]);

        if (document.querySelector(".error")) {
            props.showAlert("You are missing fields information.", "danger");
            return false;
        } else {
            const dueDate = document.querySelector("[name='due-select-year']").value + "-" + document.querySelector("[name='due-select-month']").value + "-" + document.querySelector("[name='due-select-day']").value
            let tkObj = {
                ticketId: timestamp() + ":" + props.userEmail + ":" + document.querySelector("[name='ticketTitle']").value,
                ticketInfo: document.querySelector("[name='ticketInfo']").value,
                priority: document.querySelector("[name='priority']").value,
                bugNewFeature: document.querySelector("[name='bugNewFeature']").value,
                assignedTo: document.querySelector("[name='assignedTo']").value,
                dueDate
            }
            axios.post("/api/tickets/add-ticket/", tkObj, props.config).then(
                (res) => {

                    if (res.data.affectedRows >= 1) {
                        props.showAlert(document.querySelector("[name='ticketTitle']").value + " added.", "success");
                        props.getTickets(props.userEmail);
                        resetFunction("add");
                    } else {
                        props.showAlert("Something went wrong", "danger");
                    }



                }, (error) => {
                    props.showAlert("Something went wrong: " + error, "danger");
                });
        }

    }

    const editTicket = () => {
        Validate(["ticketTitle", "ticketInfo", "priority", "bugNewFeature", "assignedTo", "due-select-year", "due-select-month", "due-select-day"]);
        if (document.querySelector(".error")) {
            props.showAlert("You are missing fields information.", "danger");
            return false;
        } else {
            const dueDate = document.querySelector("[name='due-select-year']").value + "-" + document.querySelector("[name='due-select-month']").value + "-" + document.querySelector("[name='due-select-day']").value
            let tkObj = {
                ticketId: props.activeTicket,
                ticketInfo: document.querySelector("[name='ticketInfo']").value,
                priority: document.querySelector("[name='priority']").value,
                bugNewFeature: document.querySelector("[name='bugNewFeature']").value,
                assignedTo: document.querySelector("[name='assignedTo']").value,
                dueDate
            }
            axios.put("/api/tickets/update-ticket/", tkObj, props.config).then(
                (res) => {

                    if (res.data.affectedRows >= 1) {
                        props.showAlert(document.querySelector("[name='ticketTitle']").value + " updated.", "success");
                        props.getTickets(props.userEmail);
                        resetFunction("edit");
                    } else {
                        props.showAlert("Something went wrong", "danger");
                    }


                }, (error) => {
                    props.showAlert("Something went wrong: " + error, "danger");
                });
        }


    }


    const deleteTicket = () => {
        let whichTicket = document.querySelector("[name='ticketList']").value;
        if (whichTicket === "default") {
            return false;
        }
        axios.delete("/api/tickets/delete-ticket/" + whichTicket, props.config).then(

            (res) => {
                if (res.data.affectedRows > 0) {
                    props.showAlert("Success in deleting.", "info");
                    props.getTickets(props.userEmail);
                    resetFunction("delete");
                    setConfirm((confirm) => "");
                } else {
                    props.showAlert("That did not work.", "danger");
                }

            }, (error) => {
                props.showAlert("Something didn't work.", "danger");
            }

        )


    }



    useEffect(() => {
        if (loaded === false) {
            props.getTickets(props.userEmail);
            setLoaded((loaded) => true);
        }
    }, []);

    return (<div className="row">
        {props.ticketInfo !== null ?
            <div className="col-md-12">
                <TicketList ticketInfo={props.ticketInfo} populateFields={populateFields} />
            </div> : null
        }
        <div className="col-md-12">
            <div className="btn-group block">
                <button className={func === "add" ? "btn btn-primary active" : "btn btn-primary"} onClick={() => resetFunction("add")}>New Ticket</button>
                <button className={func === "edit" ? "btn btn-primary active" : "btn btn-primary"} onClick={() => resetFunction("edit")}>Edit Ticket</button>
                <button className={func === "delete" ? "btn btn-primary active" : "btn btn-primary"} onClick={() => resetFunction("delete")}>Delete Ticket</button>
            </div>
        </div>


        {func !== "delete" ?
            <React.Fragment>
                <DateSelector menu={"due"} />
                <div className="col-md-12">
                    <input type="text" className="form-control" name="ticketTitle" placeholder="Ticket title" />
                    <select className="form-control" name="priority">
                        <option value="default">Select priority level</option>
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                        <option value="critical">Critical priority</option>
                    </select>
                    <select className="form-control" name="bugNewFeature">
                        <option value="default">Is this a bug or new feature?</option>
                        <option value="bug">Bug report</option>
                        <option value="newFeature">New feature request</option>
                    </select>

                    <input type="text" className="form-control" name='assignedTo' placeholder="Assigned to:" />
                    <textarea className="form-control" rows="5" name="ticketInfo" placeholder="Ticket info"></textarea>
                    {func === "add" ?
                        <button className="btn btn-primary btn-block" onClick={() => addTicket()}>Add ticket</button>
                        :
                        <button className="btn btn-primary  btn-block" onClick={() => editTicket()}>Edit ticket</button>}
                </div>

            </React.Fragment>
            :




            <div className="col-md-12">


                {confirm === "deleteTicket" ?
                    <div role="alert" className="alert alert-danger">
                        <p>Are you sure you want to delete this ticket?</p>
                        <button className="btn btn-warning" onClick={() => deleteTicket()}>Yes</button>
                        <button className="btn btn-secondary" onClick={() => setConfirm((confirm) => "")}>No</button>
                    </div> :
                    <button className="btn btn-danger btn-block" onClick={() => setConfirm((confirm) => "deleteTicket")}>Delete ticket</button>}
            </div>




        }
    </div>)
}

export default TicketBuilder;
