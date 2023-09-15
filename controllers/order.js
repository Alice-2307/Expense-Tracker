const Razorpay = require("razorpay");

const Order = require("../models/order");

exports.purchasePremium = async (req, res, next) => {
    try {
        const amount = 249900;
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const order = await rzp.orders.create({ amount, currency: "INR" })
        await req.user.createOrder({ orderId: order.id, status: "PENDING" })
        res.status(201).json({ order, key_id: rzp.key_id })
    } catch (err) {
        console.log(err);
        res.status(403).json({ Error: "An error occurresd" });
    }
}

exports.updateTransaction = async (req, res, next) => {
    try {
        const paymentId = req.body.payment_id;
        const orderId = req.body.order_id;

        const order = await Order.findOne({ where: { orderId: orderId } })
        if (paymentId !== null) {
            await Promise.all([
                order.update({ paymentId: paymentId, status: "successful" }),
                req.user.update({ isPremium: true })
            ]);
            res.status(201).json({ success: true, message: "Transaction Successful" });
        } else {
            await Promise.all([
                order.update({ status: "failed" }),
                req.user.update({ isPremium: false })
            ]);
            res.status(202).json({ success: false, message: "Transaction failed" });
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ Error: "An error occurred" })
    }
}

