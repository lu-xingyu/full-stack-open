const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true //  If there are already documents in the database that violate the uniqueness condition, no index will be created.
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }  // define the constraints for the element in the notes array 
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User