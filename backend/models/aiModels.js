const mongoose = require('mongoose')
const Schema = mongoose.Schema

const {companyConnect, userConnect} = require('../database/dbConnection') 

const companySchema = new Schema({
    name: {
        type: String
    },
    status: {
        type: String
    },
    categories: {
        subCategory: {
            item: [
            {
                name: {
                    type: String
                },
                image: {
                    type: String
                },
                prompt: {
                    type: String
                },
                negativePrompt: {
                    type: String
                }
            }
        ]
        }
    }
}, { collection: 'Companies' })

const userSchema = new Schema({
    user: {
        type: String
    },
    company: {
        type: String
    },
    prompt: {
        type: String
    },
    image: {
        type: String
    },
    mask: {
        type: String
    },
    output: {
        type: String
    }

}, { collection: 'User' })

const Company = companyConnect.model('Company', companySchema);
const User = userConnect.model('User', userSchema);

module.exports = { Company, User }
