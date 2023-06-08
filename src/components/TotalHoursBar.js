import { useState } from "react";

function TotalHoursBar( {onChange} ) {
    const [hours, setHours] = useState(0);

    const handleChange = (event) => {
        setHours(event.target.value);
    }

    return <div>
        Kokia darbo apimtis? (valandos)
        <input type="number" className="totalHoursBarInput input is-success is-rounded" value={hours} onChange={handleChange} min={0}/>
        
    </div>
}

export default TotalHoursBar;