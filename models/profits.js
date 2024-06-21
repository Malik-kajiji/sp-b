const mongoose = require('mongoose');

const schema = mongoose.Schema

const profitSchema = new schema({
    month: {
        type:String,
        required:true
    },
    year: {
        type:String,
        required:true
    },
    netProfit: {
        type:Number,
        required:true
    },
    numberOfPurchases: {
        type:Number,
        default:0,
        required:true,
    }
})

profitSchema.statics.increaseProfits = async function(amount,numberOfPurchases) {
    const currentDate = new Date()
    const month = currentDate.toLocaleString('ar', { month: 'long' });
    const year = currentDate.getFullYear()

    const exists = await this.findOne({month,year})

    if(exists){
        const updatedMonth = await this.findOneAndUpdate({_id:exists._id},{
            netProfit:exists.netProfit + amount,
            numberOfPurchases:exists.numberOfPurchases + numberOfPurchases
        })

        return {...updatedMonth._doc,netProfit:exists.netProfit + amount, numberOfPurchases:exists.numberOfPurchases + numberOfPurchases}
    }else {
        const newMonth = await this.create({month,year,netProfit:amount,numberOfPurchases:numberOfPurchases})

        return newMonth
    }
}

profitSchema.statics.getAllMonths = async function() {
    const allMonths = await this.find();

    return allMonths
}

profitSchema.statics.getSingleMonth = async function(_id) {
    const Month = await this.findOne({_id});

    return Month
}

profitSchema.statics.getStatistics = async function() {
    const allMonths = await this.find();
    let allProfits = 0;
    let allPurchases = 0;
    
    allMonths.forEach(e => {
        allProfits+=e.netProfit;
        allPurchases+=e.numberOfPurchases;
    })

    return {allProfits,allPurchases}
}


module.exports = mongoose.model('profit',profitSchema)