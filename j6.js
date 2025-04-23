document.addEventListener("DOMContentLoaded", function () {
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330; 
    const today = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    const bookingDateInput = document.getElementById("bookingDate");
    const timeStartSelect = document.getElementById("timeStart");
    const timeEndSelect = document.getElementById("timeEnd");
    const testerSelect = document.getElementById("dropdown0");
    const workbenchSelect = document.getElementById("dropdown1");
    const peripheralSelect = document.getElementById("dropdown2");
    peripheralSelect.options[0].setAttribute("selected","selected");
    const proceedBtn = document.getElementById("proceedToStep2");
    proceedBtn.setAttribute("data-clicked", "false");
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 14);
    const formatDate = (date) => {
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
    };
    bookingDateInput.min = formatDate(today);
    bookingDateInput.max = formatDate(maxDate);
    bookingDateInput.value = formatDate(today);
    testerSelect.addEventListener("change", function () {
        const value = testerSelect.value;
        workbenchSelect.innerHTML = '';

        const optionsList = value === "option1"
        ? ["Eagle12", "Eagle13", "Eagle14", "Eagle16", "Eagle17", "Eagle2", "Eagle3", "Eagle4", "Eagle5", "Eagle6"]
        : ["ETS800 08 H1", "ETS800 08 H2", "ETS800 11 H1", "ETS800 11 H2", "ETS800 15H1", "ETS800 15H2", "ETS800 18 H1", "ETS800 20 H1", "ETS800 21 H1", "ETS800 24 H1", "ETS800 24 H2", "ETS800 26 H1", "ETS800 26 H2"];
    
        optionsList.forEach((item, index) => {
            const opt = document.createElement("option");
            opt.value = item;
            opt.textContent = item.replace("workbench", "Workbench ");
            if (index === 0) opt.setAttribute("selected", "selected");
            workbenchSelect.appendChild(opt);
        });
        testerSelect.querySelectorAll("option").forEach(opt => opt.removeAttribute("selected"));
        testerSelect.selectedOptions[0].setAttribute("selected", "selected");
    });
    function generateTimeSlots(minHour = 0, minMinute = 0) {
        timeStartSelect.innerHTML = '';
        timeEndSelect.innerHTML = '';
    
        for (let hour = minHour; hour <= 23; hour++) {
            for (let minute = (hour === minHour ? minMinute : 0); minute < 60; minute += 30) {
                const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeStartSelect.appendChild(option);
            }
        }
        
        const firstStartTime = timeStartSelect.options[0].value;
        timeStartSelect.value = firstStartTime;
        timeStartSelect.options[0].setAttribute('selected', 'selected');
        populateEndTimes(firstStartTime);
    }
    
    function populateEndTimes(startTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        let startTotalMins = startHour * 60 + startMinute + 30;
        timeEndSelect.innerHTML = '';
        
        for (let mins = startTotalMins; mins < 1440; mins += 30) {
            const hour = Math.floor(mins / 60) % 24;
            const minute = mins % 60;
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeEndSelect.appendChild(option);
        }
        
        // Add 00:00 as the last option if needed
        if (timeEndSelect.options.length === 0 || 
            timeEndSelect.options[timeEndSelect.options.length-1].value !== "00:00") {
            const option = document.createElement('option');
            option.value = "00:00";
            option.textContent = "00:00";
            timeEndSelect.appendChild(option);
        }
        
        // Select the first option by default
        if (timeEndSelect.options.length > 0) {
            timeEndSelect.value = timeEndSelect.options[0].value;
            timeEndSelect.options[0].setAttribute('selected', 'selected');
        }
    }
    bookingDateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const isToday = selectedDate.toDateString() === today.toDateString();

        if (isToday) {
            let currentHour = today.getHours();
            let currentMinute = today.getMinutes();

            if (currentMinute >= 30) {
                currentHour += 1;
                currentMinute = 0;
            } else {
                currentMinute = 30;
            }

            generateTimeSlots(currentHour, currentMinute);
        } else {
            generateTimeSlots(0, 0);
        }
    });

    timeStartSelect.addEventListener('change', function () {
        populateEndTimes(this.value);
        timeStartSelect.querySelectorAll("option").forEach(opt => opt.removeAttribute("selected"));
        timeStartSelect.selectedOptions[0].setAttribute("selected", "selected");
    });
    timeEndSelect.addEventListener('change', function () {
        timeEndSelect.querySelectorAll("option").forEach(opt => opt.removeAttribute("selected"));
        timeEndSelect.selectedOptions[0].setAttribute("selected", "selected");
    });
        let currentHour = today.getHours();
        let currentMinute = today.getMinutes();
    
        if (currentMinute >= 30) {
            currentHour += 1;
            currentMinute = 0;
        } else {
            currentMinute = 30;
        }
    
    generateTimeSlots(currentHour, currentMinute);
    workbenchSelect.addEventListener('change',function(){
        workbenchSelect.querySelectorAll("option").forEach(opt => opt.removeAttribute("selected"));
        workbenchSelect.selectedOptions[0].setAttribute("selected", "selected");
    });
    peripheralSelect.addEventListener("click",function(){
        peripheralSelect.querySelectorAll("option").forEach(opt=>opt.removeAttribute("selected"));
        peripheralSelect.selectedOptions[0].setAttribute("selected","selected");
    });
    proceedBtn.addEventListener("click", function (e) {
        const allDropdowns = document.querySelectorAll("select");
        let allSelected = true;

        allDropdowns.forEach(dropdown => {
            if (!dropdown.value) {
                allSelected = false;
            }
        });

        if (!bookingDateInput.value || !timeStartSelect.value || !timeEndSelect.value) {
            allSelected = false;
        }

        // Check that end time is after start time
        const startTime = timeStartSelect.value;
        const endTime = timeEndSelect.value;

        if (startTime && endTime) {
            const [sh, sm] = startTime.split(":").map(Number);
            const [eh, em] = endTime.split(":").map(Number);

            const startMins = sh * 60 + sm;
            const endMins = eh * 60 + em;
            if (endMins <= startMins) {
                alert("End time must be after start time.");
                return;
            }
        }

        if (allSelected) {
            this.setAttribute("data-clicked", "true");
        } else {
            alert("Please fill all fields before proceeding.");
        }
    });
});