const mongoose = require('mongoose')
const mongodb = require('mongodb')

const userConnect = mongoose.createConnection('', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'AIProject' })
console.log("user db connected")

const companyConnect = mongoose.createConnection('', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'AIProjectCompanies' })
console.log("company db connected")

module.exports = { userConnect, companyConnect }
