// function collectData() {
//     let date = document.getElementById("date").value;
//     let month = document.getElementById("month").value;
//     let year = document.getElementById("year").value;

//     console.log('Hey');
//     document.getElementById("p1").innerHTML = `${date}-${month}-${year}`;
// }

// const date_picker_element = document.getElementById('date-picker')

// const selected_date_element = document.getElementById('selected-date')
// selected_date_element.textContent= ""
// //document.querySelector('.lol .date-picker .selected-date');

// const dates_element = document.getElementById("dates")
// //document.querySelector('.lol .date-picker .dates');
// const mth_element = document.getElementById("mth")
// //document.querySelector('.lol .date-picker .dates .month .mth');
// const next_mth_element = document.getElementById("next-mth")
// //document.querySelector('.lol .date-picker .dates .month .next-mth');
// const prev_mth_element = document.getElementById("prev-mth")
// //document.querySelector('.lol .date-picker .dates .month .prev-mth');
// const days_element = document.getElementById("days")
// //document.querySelector('.lol .date-picker .dates .days');

const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');
const mth_element = document.querySelector('.date-picker .dates .month .mth');
const next_mth_element = document.querySelector('.date-picker .dates .month .next-mth');
const prev_mth_element = document.querySelector('.date-picker .dates .month .prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

mth_element.textContent = months[month] + ' ' + year;

selected_date_element.textContent = formatDate(date);
selected_date_element.dataset.value = selectedDate;

populateDates();

// EVENT LISTENERS
date_picker_element.addEventListener('click', toggleDatePicker);
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPrevMonth);

// FUNCTIONS
function toggleDatePicker (e) {
    var path = e.path || (e.composedPath && e.composedPath());
	if (!checkEventPathForClass(path, 'dates')) {
		dates_element.classList.toggle('active');
	}
}

function goToNextMonth (e) {
	month++;
	if (month > 11) {
		month = 0;
		year++;
	}
	mth_element.textContent = months[month] + ' ' + year;
	populateDates();
}

function goToPrevMonth (e) {
	month--;
	if (month < 0) {
		month = 11;
		year--;
	}
	mth_element.textContent = months[month] + ' ' + year;
	populateDates();
}

function populateDates () {
	days_element.innerHTML = '';
	let amount_days = 31;

	if (month == 1) {
		amount_days = 28;
	}
    else if(month == 3 || month == 5 ||month == 8 ||month == 10 ){
        amount_days = 30;
    }

	for (let i = 0; i < amount_days; i++) {
		const day_element = document.createElement('div');
		day_element.classList.add('day');
		day_element.textContent = i + 1;
        console.log(month +" " +  i)

		if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
			day_element.classList.add('selected');
		}

		day_element.addEventListener('click', function () {
			selectedDate = new Date(year, month, (i + 1))
            selectedDay = (i + 1);
			selectedMonth = month;
			selectedYear = year;
            
			selected_date_element.textContent = formatDate(selectedDate);
			selected_date_element.dataset.value = selectedDate;

			populateDates();
		});

		days_element.appendChild(day_element);
	}
}

// HELPER FUNCTIONS
function checkEventPathForClass (path, selector) {
	for (let i = 0; i < path.length; i++) {
		if (path[i].classList && path[i].classList.contains(selector)) {
			return true;
		}
	}
	
	return false;
}
function formatDate (d) {
	let day = d.getDate();

	if (day < 10) {
		day = '0' + day;
	}

	let month = d.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}

	let year = d.getFullYear();
    console.log(day + ' / ' + month + ' / ' + year)

	return day + ' / ' + month + ' / ' + year;
}