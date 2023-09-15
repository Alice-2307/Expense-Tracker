const express = require("express");

const userAuthenticate = require("../middlewares/auth").authentication;

const purchaseController = require("../controllers/order");

const router = express.Router();

router.get("/premium", userAuthenticate, purchaseController.purchasePremium)

router.post("/updatetransactionstatus", userAuthenticate, purchaseController.updateTransaction)

module.exports = router;