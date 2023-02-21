const mongoose = require('mongoose')
const validateMongoDbId = (id) =>{
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isvalid) throw new Error('This ID is not valid or not found...')
}