const express = require("express")

const router = express.Router();

const expenseController = require("../controllers/expense");

const userAuthentication = require("../middlewares/auth").authentication;

router.post("/addExpense", userAuthentication, expenseController.addExpense);

router.get("/getExpense", userAuthentication, expenseController.getExpense);

router.delete("/:id", userAuthentication, expenseController.deleteExpense);

module.exports = router;