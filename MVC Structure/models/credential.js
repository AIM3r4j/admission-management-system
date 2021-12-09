const mongoose = require('mongoose')
const Schema = mongoose.Schema

const credentialSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'student'
    }
})

const Credential = mongoose.model('credential', credentialSchema)
module.exports = Credential