// Default Admin Account
const defaultAdmin = {
    username: "admin",
    password: "admin123",
    role: "admin"
};

// Initialize users if empty
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([defaultAdmin]));
}

window.onload = function () {
    if (localStorage.getItem("loggedInUser")) {
        showApp();
    }
};

// SHOW FORMS
function showRegister() {
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("registerContainer").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerContainer").classList.add("hidden");
    document.getElementById("loginContainer").classList.remove("hidden");
}

// REGISTER
function register() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const message = document.getElementById("registerMessage");

    let users = JSON.parse(localStorage.getItem("users"));

    if (users.find(user => user.username === username)) {
        message.textContent = "Username already exists!";
        message.style.color = "red";
        return;
    }

    users.push({ username, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Registered successfully!";
    message.style.color = "green";
}

// LOGIN
function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    let users = JSON.parse(localStorage.getItem("users"));
    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        showApp();
    } else {
        message.textContent = "Invalid credentials!";
        message.style.color = "red";
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("loggedInUser");
    location.reload();
}

// SHOW APP
function showApp() {
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("registerContainer").classList.add("hidden");
    document.getElementById("appContainer").classList.remove("hidden");

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    document.getElementById("welcomeText").textContent = 
        "Welcome " + user.username + " (" + user.role + ")";

    if (user.role === "admin") {
        document.getElementById("adminPanel").classList.remove("hidden");
        displayUsers();
    }

    displayItems();
}


function addItem() {
    const input = document.getElementById("itemInput");
    const item = input.value.trim();
    if (!item) return;

    let items = JSON.parse(localStorage.getItem("items")) || [];
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));

    input.value = "";
    displayItems();
}

function displayItems() {
    const list = document.getElementById("itemList");
    list.innerHTML = "";

    let items = JSON.parse(localStorage.getItem("items")) || [];

    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item}
            <div>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function editItem(index) {
    let items = JSON.parse(localStorage.getItem("items"));
    let newItem = prompt("Edit item:", items[index]);
    if (newItem) {
        items[index] = newItem;
        localStorage.setItem("items", JSON.stringify(items));
        displayItems();
    }
}

function deleteItem(index) {
    let items = JSON.parse(localStorage.getItem("items"));
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

//////////////////////////////////////////////////////
// ADMIN MANAGE USERS
//////////////////////////////////////////////////////

function displayUsers() {
    const list = document.getElementById("userList");
    list.innerHTML = "";

    let users = JSON.parse(localStorage.getItem("users"));

    users.forEach((user, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${user.username} (${user.role})
            <div>
                <button onclick="editUser(${index})">Edit</button>
                <button onclick="deleteUser(${index})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function editUser(index) {
    let users = JSON.parse(localStorage.getItem("users"));
    let newPassword = prompt("Enter new password:");
    if (newPassword) {
        users[index].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        displayUsers();
    }
}

function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem("users"));

    if (users[index].role === "admin") {
        alert("Cannot delete admin account!");
        return;
    }

    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    displayUsers();
}
