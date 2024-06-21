const mongoose = require('mongoose');
const schema = mongoose.Schema

const resetLinkSchema = new schema({
    userId: {
        type:String,
        required:true
    },
},{timestamps:true})

resetLinkSchema.statics.createLink = async function(userId) {
    const link = await this.create({userId})

    return link
}

module.exports = mongoose.model('resetLink',resetLinkSchema)