const form = document.getElementById("expense");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("error")

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userData = {
        name: name.value,
        email: email.value,
        password: password.value
    };
    try {
        let data = await axios.post("http://54.252.144.251:3000/user/signup", userData);
        window.location.href = "../login/login.html";
    } catch (err) {
        console.log(err);
        if (err.response !== undefined) {
            error.textContent = `Error: ${err.response.data.Error}`
        }
        else {
            error.textContent = `Error: ${err.message}`
        }
    }
});