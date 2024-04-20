const timeRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const activeAlarms = document.querySelector(".alarms-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("/alarm.mp3");
const am = document.getElementById('am');
const pm = document.getElementById('pm');

let alarmIndex = 0;
let alarmsArray = [];
let initialHour = 0;
let initialMinute = 0;
let timeVal = 'AM';

const appendZero = (value) => (value < 10 ? "0" + value : value);

am.addEventListener('click', () => {
    am.style.backgroundColor = '#0d47a1';
    pm.style.backgroundColor = '';
    timeVal = 'AM';
})
pm.addEventListener('click', () => {
    pm.style.backgroundColor = '#0d47a1';
    am.style.backgroundColor = '';
    timeVal = 'PM';
})

function formatTime(timeString) {
    const [hourString, minute, second] = timeString.split(":");
    if (second == undefined) {
        const hour = +hourString % 24;
        const hourVal = hour % 12 || 12
        return (hourVal < 10 ? '0' : '') + hourVal + " : " + minute + (hour < 12 ? " AM" : " PM");
    }
    const hour = +hourString % 24;
    const hourVal = hour % 12 || 12
    return (hourVal < 10 ? '0' : '') + hourVal + " : " + minute + " : " + second + (hour < 12 ? " AM" : " PM");
}

const displayTimer = () => {
    const date = new Date();
    const currentTime = date.toLocaleTimeString("en-US", {
        hour12: false
    });
    timeRef.textContent = formatTime(currentTime);

    alarmsArray.forEach((alarm) => {
        if (alarm.isActive && alarm.time === formatTime(currentTime.slice(0, 5))) {
            alarmSound.play();
        }
    });
};

const createAlarm = (hour, minute) => {
    alarmIndex += 1;

    const alarmObj = {
        id: `${alarmIndex}_${hour}_${minute}`,
        time: `${appendZero(hour)} : ${appendZero(minute)} ${timeVal}`,
        isActive: false
    }

    alarmsArray.push(alarmObj)
    const alarmDiv = document.createElement("div");
    alarmDiv.className = "alarm";
    alarmDiv.dataset.id = alarmObj.id;
    alarmDiv.innerHTML = `<span>${alarmObj.time}</span>`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => toggleAlarm(alarmObj));
    alarmDiv.appendChild(checkbox);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", () => deleteAlarm(alarmObj));
    alarmDiv.appendChild(deleteButton);

    activeAlarms.appendChild(alarmDiv);
};

const toggleAlarm = (alarm) => {
    alarm.isActive = !alarm.isActive;
    if (alarm.isActive) {
        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
        if (alarm.time === currentTime) {
            alarmSound.play();
        }
    } else {
        alarmSound.pause();
    }
};

const deleteAlarm = (alarm) => {
    const index = alarmsArray.indexOf(alarm);
    if (index > -1) {
        alarmsArray.splice(index, 1);
        document.querySelector(`[data-id="${alarm.id}"]`).remove();
    }
};

clearAllButton.addEventListener("click", () => {
    alarmsArray = [];
    activeAlarms.innerHTML = "";
});

setAlarm.addEventListener("click", () => {
    let hour = parseInt(hourInput.value) || 0;
    let minute = parseInt(minuteInput.value) || 0;

    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
        alert("Invalid hour or minute. Please enter values within the valid range!");
        return;
    }

    if (!alarmsArray.some(alarm => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`)) {
        createAlarm(hour, minute);
    }

    [hourInput.value, minuteInput.value] = ["", ""];
});

window.onload = () => {
    setInterval(displayTimer, 1000);
    [hourInput.value, minuteInput.value] = ["", ""];
};