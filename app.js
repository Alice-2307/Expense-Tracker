const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
env.config();

const sequelize = require("./utils/database");

const user = require("./routers/user");
const expense = require("./routers/expense");
const purchase = require("./routers/purchase");
const premium = require("./routers/premium");
const forgotPassword = require("./routers/password");

const User = require("./models/user")
const Expense = require("./models/expense")
const Order = require("./models/order");
const forgotPasswordRequest = require("./models/password")
const downloadFile = require("./models/file");
const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags:"a"})


app.use(cors());
app.use(helmet());
app.use(morgan('combined',{stream: accessLogStream}));
app.use(express.json());

app.use("/user", user);

app.use("/expense", expense)

app.use("/purchase", purchase)

app.use("/premium", premium);

app.use("/password", forgotPassword);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPasswordRequest);
forgotPasswordRequest.belongsTo(User);

User.hasMany(downloadFile);
downloadFile.belongsTo(User);


sequelize.sync().then(result => {
    app.listen(process.env.PORT ||3000);
}).catch(err => console.log(err));
