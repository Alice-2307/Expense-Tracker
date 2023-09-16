const form = document.getElementById("expense");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const loginData = {
        email: email.value,
        password: password.value,
    };

    try {
        let result = await axios.post("http://54.252.144.251:3000/user/login", loginData);
        console.log(result);
        alert(`${result.data.message}`);
        localStorage.setItem("token", result.data.token)
        window.location.href = "../expense/expense.html";

    } catch (err) {
        console.log(err);
        if (err.response !== undefined) {
            error.textContent = `Error: ${err.response.data.Error}`;
        } else {
            error.textContent = `Error: ${err.message}`;
        }
    }
});
