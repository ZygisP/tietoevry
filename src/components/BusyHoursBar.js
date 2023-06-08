import { useState } from "react";


function BusyHoursBar({ string }) {
    const [hours, setHours] = useState([]);

    const handleChange = (event) => {
        setHours(event.target.value);
    }

    const onkeydown = (event) => {
        event.preventDefault();
    }

    return <div>
        {string}
        <input type="number" className="busyHoursBarInput input is-success is-rounded" placeholder="0" value={hours} onChange={handleChange} min={0} max={16} onKeyDown={onkeydown}></input>

    </div>
}

export default BusyHoursBar;