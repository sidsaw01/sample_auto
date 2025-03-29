document.addEventListener('DOMContentLoaded', function () {
    //const step1 = document.getElementById('step1');
    //const step2 = document.getElementById('step2');
    const proceedBtn = document.getElementById('proceedToStep2');
    proceedBtn.setAttribute('data-clicked','false')
    //const backBtn = document.getElementById('backToStep1');
    //backBtn.setAttribute('data-clicked','false')
    //const bookSlotBtn = document.getElementById('bookSlot');

    const dropdown0 = document.getElementById('dropdown0');
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    dropdown2.options[0].setAttribute('selected','selected')
    const dropdown3 = document.getElementById('dropdown3');

    const timeStartSelect = document.getElementById('timeStart');
    const timeEndSelect = document.getElementById('timeEnd');
    const bookingDateInput = document.getElementById('bookingDate');
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];
    bookingDateInput.value = formatDate(today);
    bookingDateInput.setAttribute('value',bookingDateInput.value);

    // Workbench options based on tester selection
    const workbenchOptions = {
        option1: ['Eagle12', 'Eagle13', 'Eagle14', 'Eagle16', 'Eagle17', 'Eagle2', 'Eagle3', 'Eagle4', 'Eagle5', 'Eagle6'],
        option2: ['ETS800 08 H1', 'ETS800 08 H2', 'ETS800 11 H1', 'ETS800 11 H2', 'ETS800 18 H1', 'ETS800 20 H1', 'ETS800 21 H1', 'ETS800 24 H1', 'ETS800 24 H2', 'ETS800 26 H1', 'ETS800 26 H2', 'ETS800 15H1', 'ETS800 15H2']
    };

    // Peripheral options
    const peripheralOptions = {
        cat1: ['Option 1A', 'Option 1B', 'Option 1C'],
        cat2: ['Option 2A', 'Option 2B', 'Option 2C'],
        cat3: ['Option 3A', 'Option 3B', 'Option 3C']
    };

    // Initialize date restrictions (today to 15 days later)
    // Set today's date as the default value
    //const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);

    bookingDateInput.min = formatDate(today);
    bookingDateInput.max = formatDate(maxDate);
    bookingDateInput.value = formatDate(today); // Set default date to today
    
    // Ensure that the date input reflects the user's selection
    bookingDateInput.addEventListener('change', function () {
        this.setAttribute('value', this.value);
    });
    // Function to update `selected` attribute dynamically
    function updateSelectedAttribute(selectElement) {
        Array.from(selectElement.options).forEach(option => {
            option.removeAttribute('selected');
        });

        if (selectElement.value) {
            selectElement.querySelector(`option[value="${selectElement.value}"]`).setAttribute('selected', 'selected');
        }
    }

    // Generate available time slots
    function generateTimeSlots(minHour = 0, minMinute = 0) {
        const timeStartSelect = document.getElementById('timeStart');
        const timeEndSelect = document.getElementById('timeEnd');
    
        timeStartSelect.innerHTML = '';
        timeEndSelect.innerHTML = '';
    
        let defaultStartTime = null;
        let defaultEndTime = null;
    
        for (let hour = minHour; hour < 24; hour++) {
            for (let minute = hour === minHour ? minMinute : 0; minute < 60; minute += 30) {
                let time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
                let optionStart = document.createElement('option');
                optionStart.value = time;
                optionStart.textContent = time;
                timeStartSelect.appendChild(optionStart);
    
                let optionEnd = document.createElement('option');
                optionEnd.value = time;
                optionEnd.textContent = time;
                timeEndSelect.appendChild(optionEnd);
    
                // Set default start time as the first available time
                if (!defaultStartTime) {
                    defaultStartTime = time;
                }
    
                // Set default end time as 1 hour after the start time
                if (defaultStartTime && !defaultEndTime) {
                    let endHour = hour;
                    let endMinute = minute + 60;
                    if (endMinute >= 60) {
                        endHour += 1;
                        endMinute -= 60;
                    }
                    defaultEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
                }
            }
        }
        let optionEnd = document.createElement('option');
        optionEnd.value = "00:00";
        optionEnd.textContent = "00:00";
        timeEndSelect.appendChild(optionEnd);
        // Set default selected options and update the `selected` attribute
        if (defaultStartTime) {
            timeStartSelect.value = defaultStartTime;
            timeStartSelect.querySelector(`option[value="${defaultStartTime}"]`).setAttribute('selected', 'selected');
        }
    
        if (defaultEndTime) {
            timeEndSelect.value = defaultEndTime;
            timeEndSelect.querySelector(`option[value="${defaultEndTime}"]`).setAttribute('selected', 'selected');
        }
    }
    
    // Update available time slots when the date is selected
    bookingDateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
    
        if (selectedDate.toDateString() === today.toDateString()) {
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
            generateTimeSlots();
        }
    });
    
    // Ensure end time starts from selected start time
    document.getElementById('timeStart').addEventListener('change', function () {
        const selectedStartTime = this.value;
        const timeEndSelect = document.getElementById('timeEnd');
    
        // Clear and regenerate end time options based on selected start time
        timeEndSelect.innerHTML = '';
        Array.from(document.getElementById('timeStart').options).forEach(option => {
            if (option.value > selectedStartTime) {
                let optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.textContent;
                timeEndSelect.appendChild(optionElement);
            }
        });
    
        // Default end time is first available option
        if (timeEndSelect.options.length > 0) {
            timeEndSelect.options[0].setAttribute('selected', 'selected');
        }
        let optionEnd = document.createElement('option');
        optionEnd.value = "00:00";
        optionEnd.textContent = "00:00";
        timeEndSelect.appendChild(optionEnd);
    });
    // Initialize default time slots for today
    if (today.getMinutes()>=30){
        generateTimeSlots(today.getHours()+1, 0)
    }else{
        generateTimeSlots(today.getHours(),30)
    }
        
    //generateTimeSlots(today.getHours(), today.getMinutes() >= 30 ? 30 : 0);

    // Update workbench options based on tester selection
    dropdown0.addEventListener('change', function () {
        dropdown1.innerHTML = '<option value="">Select Workbench</option>';

        if (this.value in workbenchOptions) {
            workbenchOptions[this.value].forEach(option => {
                let optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                dropdown1.appendChild(optionElement);
            });
        }

        updateSelectedAttribute(this);
    });

    // Update peripheral options based on selection
    dropdown2.addEventListener('change', function () {
        dropdown3.innerHTML = '<option value="">Select Option</option>';

        if (this.value in peripheralOptions) {
            peripheralOptions[this.value].forEach(option => {
                let optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                dropdown3.appendChild(optionElement);
            });
        }

        updateSelectedAttribute(this);
    });

    // Apply selected attribute update to all dropdowns
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', function () {
            updateSelectedAttribute(this);
        });
    });

    // Proceed to Step 2
    proceedBtn.addEventListener('click', function () {
        const tester = dropdown0.value;
        const workbench = dropdown1.value;
        const bookingDate = bookingDateInput.value;
        const timeStart = timeStartSelect.value;
        const timeEnd = timeEndSelect.value;

        let missingFields = [];

        if (!tester) missingFields.push('Tester');
        if (!workbench) missingFields.push('Workbench');
        if (!bookingDate) missingFields.push('Date');
        if (!timeStart) missingFields.push('Start Time');
        if (!timeEnd) missingFields.push('End Time');

        if (missingFields.length > 0) {
            alert(`Please select: ${missingFields.join(', ')}`);
            return;
        }

        

        // Mark Proceed as clicked and Back as not clicked
        this.setAttribute('data-clicked', 'true');
        //backBtn.setAttribute('data-clicked', 'false');

        //step1.style.display = 'none';
        //step2.style.display = 'block';
    });

    // Back to Step 1
    //backBtn.addEventListener('click', function () {
    //    // Mark Back as clicked and Proceed as not clicked
    //    this.setAttribute('data-clicked', 'true');
     //   proceedBtn.setAttribute('data-clicked', 'false');
//
    //    step1.style.display = 'block';
    //    step2.style.display = 'none';
    //});
    // Final booking confirmation
    //bookSlotBtn.addEventListener('click', function () {
    //    const peripheral = dropdown2.value;
    //    const peripheralOption = dropdown3.value;
//
    // //   let missingFields = [];

    //    if (!peripheral) missingFields.push('Peripheral');
    //    if (!peripheralOption) missingFields.push('Peripheral Option');
//
    //    if (missingFields.length > 0) {
     //       alert(`Please select: ${missingFields.join(', ')}`);
    //        return;
    //    }

        // Mark button as clicked and confirm booking
    //    this.setAttribute('data-clicked', 'true');
   //     alert("Slot successfully booked!");
    //});
});