const User = require("../models/user");

const UserService = require("../services/userservice");

const S3Service = require("../services/s3service");

const downloadFile = require("../models/file");

exports.showLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['name', 'totalExpense'],
            order: [['totalExpense', 'Desc']]
        })
        res.status(201).json({ leaderboard, isPremium: req.user.isPremium });

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: "An error occurred" })
    }
}

exports.downloadFile = async (req, res, next) => {

    try {

        if (req.user.isPremium === true) {
            const expense = await UserService.getExpenses(req)

            const stringifiedExpenses = JSON.stringify(expense);
            const userId = req.user.id;
            const fileName = `Expense${userId}/${new Date()}.txt`;
            const fileUrl = await S3Service.uploadtoS3(stringifiedExpenses, fileName);
            console.log(fileUrl);
            await downloadFile.create({
                fileUrl: fileUrl,
                userId: req.user.id
            })
            res.status(200).json({ fileUrl, success: true, isPremium: req.user.isPremium });
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ Error: "An error occurred" })
    }
}

exports.downloadOldFile = async (req, res, next) => {

    try {

        const allFile = await req.user.getDownloadfiles({
            attributes: ['fileUrl', 'createdAt']
        })
        console.log(allFile);
        res.status(200).json({ allFile, success: true, isPremium: req.user.isPremium });

    } catch (err) {
        console.log(err)
        res.status(500).json({ Error: "An error occurred" })
    }
}


