const input = document.getElementById("input");
const btn = document.getElementById("btn");
const loading = document.querySelector(".loading");
const spin = document.getElementById("spin")
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let q = `${latitude},${longitude}`;
    getData(q);
  });
} else {
  getData("cairo");
}

btn.addEventListener("click", function () {

  let city = input.value;
  getData(city);
  clearInput();
});

document.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    let city = input.value;
    getData(city);
    clearInput();
  }
});

async function getData(location) {
  try {
    loading.classList.remove("d-none");
    spin.classList.add("fa-spin")
    const api = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=1600cec7293a4451b08184142241006&days=3&q=${location}`
    );
    const response = await api.json();

    displayData(response);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter valid city!",
    });
  } finally {
    loading.classList.add("d-none");
    spin.classList.remove("fa-spin")
  }
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

function displayData(response) {
  let cartona = ``;

  for (let i = 0; i < response.forecast.forecastday.length; i++) {
    let date = new Date(response.forecast.forecastday[i].date);

    if (i == 0) {
      cartona += `
  <div class="col-sm-6 col-lg-4 ">

          <div class="bg-white p-4 h-100 rounded shadow">
          <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <p class="m-0 date">${days[date.getDay()]}</p>
          <h3 class="date fw-normal m-0">
          ${date.getDate()}${months[date.getMonth()]}</h3>
          </div>
          
          <h1  class=" text-warning text-start city"><i class="fa-solid fa-city pe-2 "></i>${response.location.name}</h1>
          <p class=" m-2 fw-bold head">${response.current.temp_c}<span class="deg">o</span>C</p>
          
          <div class="d-flex justify-content-between align-items-center mt-2" >
          <img src="${
            response.current.condition.icon
          }" class="" alt="temp icon" />
          <p class="text-primary m-0">${response.current.condition.text}</p>
          </div>
          </div>
        </div>
  `;
    } else {
      cartona += `
      <div class="col-sm-6 col-lg-4">
<div class="bg-white p-4 h-100 rounded shadow">
  <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2 ">
  <p class="m-0 date ">${days[date.getDay()]}</p>
  <h3 class="date fw-normal m-0">
          ${date.getDate()}${months[date.getMonth()]}</h3>
  </div>
                
                <img src="${
                  response.forecast.forecastday[i].day.condition.icon
                }" class="mb-4" alt="temp icon" />

                <div class="d-flex justify-content-between align-items-center mt-4">
                <div>
                <p class="mb-2 fs-5 text-danger">${
                  response.forecast.forecastday[i].day.maxtemp_c
                }<span class="deg">o</span>C</p>
                <p class="m-0 text-info">${
                  response.forecast.forecastday[i].day.mintemp_c
                }<span class="deg">o</span>C</p>
                </div>
                <p class="text-primary m-0">${
                  response.forecast.forecastday[i].day.condition.text
                }</p>
                </div>
                
                
                
</div>
            </div>
      `;
    }
  }

  document.getElementById("rowData").innerHTML = cartona;
}

function clearInput() {
  input.value = null;
}
