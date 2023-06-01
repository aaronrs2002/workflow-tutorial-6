import React, { useState, useEffect } from "react";

const DateSelector = (props) => {
    let [loaded, setLoaded] = useState(false);
    const years = ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let [zeroToThirtyOne, setZeroToThirtyOne] = useState(null);


    const genericUpdate = () => {

        console.log("we may need this");

    }


    useEffect(() => {
        if (loaded === false && zeroToThirtyOne === null) {
            let tempCount = [];
            for (let i = 1; i < 32; i++) {
                if (i < 10) {
                    tempCount.push("0" + i);
                } else {
                    tempCount.push(i);
                }

            }
            setZeroToThirtyOne((zeroToThirtyOne) => tempCount);


            setLoaded((loaded) => true);
        }
    }, []);



    return (
        <React.Fragment>
            <div className="col-md-4">
                <select name={props.menu + "-select-year"} className="form-control" onChange={() => genericUpdate()}>
                    <option value="default">{"Select " + props.menu + " year"}</option>
                    {years.length > 0 ? years.map((year, i) => {
                        return (<option value={year}>{year}</option>)
                    }) : null}
                </select>
            </div>
            <div className="col-md-4">
                <select name={props.menu + "-select-month"} className="form-control" onChange={() => genericUpdate()}>
                    <option value="default">{"Select " + props.menu + " month"}</option>
                    {months.length > 0 ? months.map((month, i) => {

                        return (<option key={i} value={(parseInt(i) + 1) < 10 ? "0" + (parseInt(i) + 1) : (parseInt(i) + 1)}>{month}</option>);


                    }) : null}
                </select>
            </div>
            <div className="col-md-4">
                <select name={props.menu + "-select-day"} className="form-control" onChange={() => genericUpdate()}>
                    <option value="default">{"Select " + props.menu + " day"}</option>
                    {zeroToThirtyOne !== null ? zeroToThirtyOne.map((day, i) => {
                        return (<option key={i} value={day}>{day}</option>);

                    }) : null}
                </select>
            </div>

        </React.Fragment>
    )
}

export default DateSelector;