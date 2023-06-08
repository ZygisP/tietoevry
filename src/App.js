import './App.css';
import 'bulma/css/bulma.css';
import { useState } from "react";
import TotalHoursBar from "./components/TotalHoursBar";
import TimeDueBar from "./components/TimeDueBar";
import BusyHoursBar from "./components/BusyHoursBar";

function App() {
    const [totalHours, setTotalHours] = useState(0);
    const [busyHours, setBusyHours] = useState([]);
    const [days, setDays] = useState([]);
    const onTimeDueBarChange = (days) => {
        setDays(days);
    }

    const onTotalHoursBarChange = (totalHours) => {
        setTotalHours(totalHours);
        console.log(totalHours);
    }

    const onBusyHoursBarChange = (busyHours) => {
        setBusyHours(busyHours);
        
    }

    const renderedDays = days.map((day, index) => {
        return <BusyHoursBar onChange={onBusyHoursBarChange} string={day} key={index} />
    });

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

    const makeFile = (string, name) => {
        const file = new File(string, name, {
            type: 'text/plain',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(file);

        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    const onBtnClick = (event) => {
        let total_hours = document.getElementsByClassName('totalHoursBarInput')[0].value;
        let time_due = document.getElementsByClassName('timeDueBarInput')[0].value;
        let busy_hours = document.getElementsByClassName('busyHoursBarInput');
        if ((total_hours.length != 0 || total_hours != '0') && time_due.length != 0){
        let list = [];
        let free_hours = [];
        let study_hours = []; 
        let today = new Date();
        let date_range = getDatesInRange(today, new Date(time_due));
        let today_hours = today.getHours();
        let today_minutes = today.getMinutes();
        for (let i = 0; i < busy_hours.length; i++) {
            list.push(busy_hours[i].value);
            if (i == 0) {
                let temp_value = 24 - (today_hours + (today_minutes / 0.6 / 100)) - list[list.length - 1];
                if (temp_value > 0) {
                    free_hours.push(temp_value);
                } else {
                    free_hours.push(0);
                }
            } else {
                free_hours.push(16 - list[list.length - 1]);
            }
            // for the first day we do not account for sleep so the program does not break if it is late during that day
            // 16h instead of 24h - take into account 8 hours for sleep
        }
        let avg_time = total_hours / free_hours.length;
        // checking if avg is more than any of the free time elements
           // if on some days there isnt enough free time we will add the study time to other days
           let leftover_time = 0;
           // counter for days with leftover time
           let counter = 0; 
           for (let i = 0; i < free_hours.length; i++) {
                if (free_hours[i] >= avg_time) {
                    free_hours[i] = free_hours[i] - avg_time;
                    study_hours.push(avg_time);
                    if (free_hours[i] != 0) {
                        counter++;
                    }
                } else {
                    let temp = 0;
                    temp = avg_time - free_hours[i];
                    study_hours.push(free_hours[i]);
                    free_hours[i] = 0;
                    leftover_time += temp;
                }
           }
           // adding leftover time to the closest study day
           if (leftover_time > 0) {
                for (let i = 0; i < free_hours.length; i++) {
                    if(free_hours[i] >= leftover_time) {
                        study_hours[i] += leftover_time;
                        free_hours[i] = free_hours[i] - leftover_time;
                        leftover_time = 0;
                    } else if (free_hours[i] > 0 && free_hours[i] < leftover_time) {
                        study_hours += free_hours[i];
                        let temp = leftover_time - free_hours;
                        free_hours[i] = 0;
                        leftover_time -= temp;
                    }
                }
           }
           let convertedHours = []
           let convertedMinutes = []
           let arr = []
           let obj = {}
    
           for (let i = 0; i < study_hours.length; i++) {
                convertedHours.push(Math.floor(study_hours[i]));
                convertedMinutes.push((study_hours[i] % 1) * 0.6 * 100);
                obj = {date: date_range[i], hours: convertedHours[i], minutes: Math.round(convertedMinutes[i])}
                arr.push(obj);
            }
            makeFile([JSON.stringify(arr, null, 2)], 'mokymosi-planas.txt')
        } else {
            alert('Užpildyk visus laukelius');
        }

    }
    

    return (<div className='container'>
        <TotalHoursBar onChange={onTotalHoursBarChange}/>
        <TimeDueBar onChange={onTimeDueBarChange}/>
        Įvesk užimtų valandų skaičių kiekvienai dienai:
        <div>{renderedDays}</div>
        <button id='btn-write' className='button is-medium is-rounded is-success' onClick={onBtnClick}>WRITE TO JSON</button>
    </div>)
}



export default App;