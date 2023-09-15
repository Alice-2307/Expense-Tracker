const expense = require("../models/expense");

const sequelize = require("../utils/database");

exports.addExpense = async (req, res, next) => {

    const desc = req.body.description;
    const amount = req.body.amount;
    const category = req.body.category
    const t = await sequelize.transaction();
    try {
        let result = await expense.create({
            description: desc,
            amount: amount,
            category: category,
            userId: req.user.id
        }, { transaction: t })
        let totEx = req.user.totalExpense;
        totEx += parseInt(amount);

        await req.user.update({ totalExpense: totEx }, { transaction: t })
        await t.commit();
        console.log("Expense Added")
        res.status(201).json({ expenseData: result })

    } catch (err) {
        await t.rollback();
        showError(err, res);
    }
}

exports.getExpense = async (req, res, next) => {
    try {
        const ITEMS_PER_PAGE = +req.query.item || 5;
        const page = +req.query.page || 1;
        const count = await expense.count({where: {userId: req.user.id}});
        const allExpenseData = await expense.findAll({ 
            where: { userId: req.user.id },
            offset: (page-1)*ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
        });
        let lastPage;
        if(Math.ceil(count/ITEMS_PER_PAGE)==0){
            lastPage = 1;
        }
        else{
            lastPage = Math.ceil(count/ITEMS_PER_PAGE)
        }
        console.log("Get all expense");
        res.status(200).json({
            allExpense: allExpenseData,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE* page<count,
            nextPage: page+1,
            hasPreviousPage: page>1,
            previousPage: page-1,
            lastPage: lastPage,
            isPremium: req.user.isPremium
        })

    } catch (err) {
        showError(err, res);
    }
}

exports.deleteExpense = async (req, res, next) => {
    const expenseId = req.params.id;
    const t = await sequelize.transaction();

    try {
        let deleteVal = await expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        await deleteVal.destroy({ transaction: t });
        let amount = deleteVal.amount;
        let totEx = req.user.totalExpense;
        totEx -= parseInt(amount);
        await req.user.update({ totalExpense: totEx }, { transaction: t })
        await t.commit();
        console.log("Delete Successfully");
    } catch (err) {
        await t.rollback();
        showError(err, res);
    }
}

function showError(err, res) {
    console.log(err);
    res.status(500).json({ Error: "An error occurred" })
}