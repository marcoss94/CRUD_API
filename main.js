const BASE_URL_LOGIN = "https://reqres.in";
const BASE_URL = "https://api.tdt-resources-v2.dev.tolber.io/api";
const POST_LOGIN = "/api/login";
const GET_ORGANIZATION = "/organizations-public?sort[0]=-createdAt";
const POST_ORGANIZATION = "/organizations-public";
const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");
const error = document.getElementById("error");
const containerOrganization = document.getElementById("organization");
const exitButton = document.getElementById("exit");
const nameCreate = document.getElementById("name");
const aliasNameCreate = document.getElementById("alias_name");
const createOrganization = document.getElementById("create-organization");

submit.addEventListener("click", submitLogin);
exitButton.addEventListener("click", logout);
createOrganization.addEventListener("click", handleCreate);
document.addEventListener("DOMContentLoaded", () => {
  if (localStorageFunction.get("token")) {
    showList();
  }
  showLogin();
});

const localStorageFunction = {
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

function logout() {
  localStorageFunction.remove("token");
  containerOrganization.innerHTML = "";
  showLogin();
}

function handleCreate(e) {
  e.preventDefault();
  let formData = new FormData();
  formData.append("data[type]", "organizations");
  formData.append("data[attributes][name]", nameCreate.value);
  formData.append("data[attributes][alias_name]", aliasNameCreate.value);
  formData.append("data[attributes][organization_type_id]", "2");
  formData.append("data[attributes][subcategory_id]", "286");
  const url = BASE_URL + POST_ORGANIZATION;
  fetch(url, {
    method: "POST",
    headers: {
      Authorizatioasxadn: "Bearer " + localStorageFunction.get("token"),
      Accept: "application/json",
      "ConContent-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      showList();
    })
    .catch((error) => {
      console.log("There has been a problem with your fetch operation:", error);
    });
}
function submitLogin(e) {
  e.preventDefault();
  let user = {
    email: email.value,
    password: password.value,
  };
  error.innerHTML = "";
  fetchLogin(user);
}
function showList() {
  const url = BASE_URL + GET_ORGANIZATION;
  fetch(url, {
    headers: {
      Accept: "application/json",
      Authorizationas: `Bearer ${localStorageFunction.get("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      let output = "";
      data.data.slice(0, 10).forEach(({ id, attributes }) => {
        output += `
        <li>${id} - <span>${attributes.name}</span> - <p>${attributes.alias_name}</p>
            <span class='edit-org' data-id='${id}'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            </span> 
            <span class='delete-org' data-id='${id}'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </span> 
      </li>`;
      });
      containerOrganization.innerHTML = output;
    })
    .catch((error) => {
      console.log("There has been a problem with your fetch operation:", error);
    });
}
const showLogin = () => {
  if (!localStorageFunction.get("token")) {
    // show login
    login.classList.remove("hidden");
  } else {
    // hide login
    login.classList.add("hidden");
  }
};
function fetchLogin(params) {
  fetch(BASE_URL_LOGIN + POST_LOGIN, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      error.innerHTML = "Error en el login";
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      localStorageFunction.set("token", data.token);
      showLogin();
      showList();
    })
    .catch((error) => {
      console.log("There has been a problem with your fetch operation:", error);
    });
}
