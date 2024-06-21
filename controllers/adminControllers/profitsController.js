const profitModel = require('../../models/profits');

const getAllMonths = async (req,res) => {
    try {
        const months = await profitModel.getAllMonths();
        const statistics = await profitModel.getStatistics();

        res.status(200).json({months,statistics})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getSingleMonth = async (req,res) => {
    const { month_id } = req.params
    try {
        const months = await profitModel.getSingleMonth(month_id);

        res.status(200).json({months})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getAllMonths,
    getSingleMonth
}