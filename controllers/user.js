const user = require("../models/user")

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.postUser = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;

    try {
        let hashPassword = await bcrypt.hash(pass, 10)
        await user.create({
            name: name,
            email: email,
            password: hashPassword
        })
        console.log("User Data Added")
        res.status(201).json({ message: "User signup successfully" });

    } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
            res.status(403).json({ Error: "Email already exist" })
        }
        else {
            res.status(500).json({ Error: "An error occurred" })
        }
    }
}

exports.loginUser = async (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;

    try {
        if (email === "" || pass === "") {
            return res.status(400).json({ Error: "Required fields are empty" });
        }
        let userData = await user.findAll();

        for (let i = 0; i < userData.length; i++) {
            if (email === userData[i].email) {
                let matchPassword = await bcrypt.compare(pass, userData[i].password)
                if (matchPassword === true) {
                    const userToken = await jwt.sign({ userId: userData[i].id }, process.env.SECRET_TOKEN)
                    return res.status(200).json({ success: true, message: "User logged in successfully", token: userToken, isPremium:userData[i].isPremium})
                }
                return res.status(401).json({ success: false, Error: "Password is incorrect" })
            }
        }
        return res.status(404).json({ Error: "Email does not exist" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: "An error occurred" })
    }
}