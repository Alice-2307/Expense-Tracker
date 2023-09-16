const form = document.getElementById("expense");

const email = document.getElementById("email");

const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const emailData = {
        email: email.value,
    }
    try {
        let result = await axios.post("http://54.252.144.251:3000/password/forgotpassword", emailData)
        alert(`${result.data.message}\nYou will now be redirected to the login page.`);
        window.location.href = "../login/login.html";

    } catch (err) {
        if (err.response !== undefined) {
            error.textContent = `Error: ${err.response.data.Error}`;
        } else {
            error.textContent = `Error: ${err.message}`;
        }
    }

})