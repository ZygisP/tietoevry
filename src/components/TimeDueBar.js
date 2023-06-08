import { useState } from 'react';

function TimeDueBar({ onChange }) {
    // format is yyyy/mm/dd

    const formatDate = (yyyy, mm, dd) => {
        mm += 1;
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (dd < 10) {
            dd = '0' + dd;
        }
        return yyyy + "-" + mm + "-" + dd;
    }

    const splitDate = (date) => {
        let yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ms = date.getTime();
        return [yyyy, mm, dd, hours, minutes, ms];
    } 

    const getDatesInRange = (startDate, endDate) => {
        const date = new Date(startDate.getTime());
        const allDates = [];
        while (date <= endDate) {
            let newDate = new Date(date);
            newDate = formatDate(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
            allDates.push(newDate);
            date.setDate(date.getDate() + 1);
        }
        return allDates;
    };

    const TOMMOROW = new Date();
    const tommorowFormatted = formatDate(TOMMOROW.getFullYear(), TOMMOROW.getMonth(), TOMMOROW.getDate() + 1);

    const [days, setDays] = useState(0);

    const handleChangeDays = (event) => {
        let endDate = splitDate(new Date(event.target.value));
        // Time defaults based on the time zone, we want 0:00 though
        endDate[3] = 0;
        endDate[4] = 0;
        let allDates = getDatesInRange(new Date(), new Date(event.target.value));
        setDays(event.target.value);
        onChange(allDates);
    }

    return <div>
        Koks darbo terminas?
        <input className="timeDueBarInput input is-success is-rounded" type="date" value={days} onChange={handleChangeDays} min={tommorowFormatted}></input>
        
    </div>
}

export default TimeDueBar;