const search = document.querySelector(".header__search");
const btnSearch = document.querySelector(".header__btnSearch");
const searchInput = document.querySelector(".header__searchInput");
const actives = document.getElementsByClassName("menu__activeMenu");
const activeChannel = document.getElementsByClassName("menu__activeChannel");
const weatherPage = document.querySelector(".weatherPage");
const subscribePage = document.querySelector(".subscribe");
const cards = document.getElementsByClassName("weatherPage__card");
const nameOfCity = document.querySelectorAll(".weatherPage__nameOfCity");
const iconOfWeather = document.querySelectorAll(".weatherPage__icon");
const tempKelvin = document.querySelectorAll(".weatherPage__temp");
const humidity = document.querySelectorAll(".weatherPage__humidity");
const time = document.querySelectorAll(".weatherPage__time");
const date = document.querySelectorAll(".weatherPage__date");
const subName = document.querySelector(".subName");
const subMail = document.querySelector(".subMail");
const subPhone = document.querySelector(".subPhone");
const subAddress = document.querySelector(".subAddress");
const subBirth = document.querySelector(".subBirth");
const submitBtn = document.querySelector(".submitBtn");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal__body");

// Close and open action to search entry click
btnSearch.addEventListener("click", () => {
  search.classList.toggle("active");
});

// set active menu
for (var i = 0; i < actives.length; i++) {
  actives[i].onclick = function () {
    var panel = this.firstElementChild;
    var header = this.lastElementChild;
    removeActiveClasses();
    panel.classList.remove("menu__notActiveChannel");
    panel.classList.add("menu__activeChannel");
    panel.nextElementSibling.style.opacity = "1";
    header.style.opacity = "1";
    if (header.textContent === "Weather") {
      weatherPage.style.display = "grid";
      subscribePage.style.display = "none";
      searchInput.removeAttribute("disabled");
    } else {
      weatherPage.style.display = "none";
      subscribePage.style.display = "flex";
      searchInput.setAttribute("disabled", "false");
    }
  };
}

// set inactive menu
function removeActiveClasses() {
  for (var i = 0; i < actives.length; i++) {
    var panel = actives[i].firstElementChild;
    var header = actives[i].lastElementChild;
    panel.classList.remove("menu__activeChannel");
    panel.classList.add("menu__notActiveChannel");
    panel.nextElementSibling.style.opacity = "0.5";
    header.style.opacity = "0.5";
  }
}

let cities = ["Istanbul", "London", "Paris", "Washington", "Berlin", "Madrid"];

// send API request to openweather.com
for (let i = 0; i < cities.length; i++) {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=910906a30ab51ca86f6be45d46867b1e`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data);

      const temperature = (kelvin) => {
        return Math.round(kelvin - 273.15);
      };

      nameOfCity[i].textContent = data.name;
      iconOfWeather[i].setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      );
      tempKelvin[i].textContent = `${temperature(data.main.temp)}° C`;
      humidity[i].textContent = `${data.main.humidity}%`;

      time[i].textContent = new Date(data.dt * 1000).toLocaleTimeString(
        "en-US"
      );
      date[i].textContent = new Date(data.dt * 1000).toLocaleDateString(
        "en-US"
      );
    })
    .catch((err) => {
      console.log("Hata", err);
    });
}

// filter between cards
searchInput.addEventListener("keyup", function (e) {
  let input = e.target.value.toUpperCase();

  for (let i = 0; i < cards.length; i++) {
    let title = cards[i].querySelector(".weatherPage__Info div h2");

    if (title.innerText.toUpperCase().indexOf(input) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
});

function Person(name, mail, phone, address, gender, birth) {
  const obj = {};
  obj.name = name;
  obj.mail = mail;
  obj.phone = phone;
  obj.address = address;
  obj.gender = gender;
  obj.birth = birth;

  return obj;
}

// add registration data to browser with LocalStorage and view data with modal
submitBtn.addEventListener("click", function () {
  localStorage.setItem("subName", subName.value);
  localStorage.setItem("subMail", subMail.value);
  localStorage.setItem("subPhone", subPhone.value);
  localStorage.setItem("subAddress", subAddress.value);
  document.getElementsByName("gender").forEach((subGender) => {
    if (subGender.checked) {
      localStorage.setItem("subGender", subGender.value);
    }
  });
  localStorage.setItem("subBirth", subBirth.value);

  const personName = localStorage.getItem("subName");
  const personMail = localStorage.getItem("subMail");
  const personPhone = localStorage.getItem("subPhone");
  const personAddress = localStorage.getItem("subAddress");
  const personGender = localStorage.getItem("subGender");
  const personBirth = localStorage.getItem("subBirth");

  const person = new Person(
    personName,
    personMail,
    personPhone,
    personAddress,
    personGender,
    personBirth
  );

  console.log(person);

  let modalHeader = document.createElement("h2");
  modalHeader.innerHTML = `Hello ${person.name}`;
  modalBody.appendChild(modalHeader);

  for (let key in person) {
    let modalList = document.createElement("li");
    modalList.innerHTML += `${person[key]}`;
    modalBody.appendChild(modalList);
    modalList.style.marginTop = "20px";
  }

  let modalBtn = document.createElement("button");
  modalBtn.innerHTML = "Close";
  modalBody.appendChild(modalBtn);
  modalBtn.classList.add("modal__modalBtn");

  modal.classList.add("show");

  modalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    modalBody.removeChild(modalHeader);
    modalBody.removeChild(modalBtn);
  });
});
