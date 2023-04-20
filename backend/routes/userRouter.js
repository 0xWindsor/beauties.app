const Router = require('express').Router()
const { getData, createReq, createOutput, getRunId, getInfo } = require('../controller/userController')

Router.post('/createReq/:id', createReq)
Router.post('/createOutput/:id', createOutput)
Router.get('/getData/:id', getData)
Router.get('/getRunId', getRunId)
Router.get('/getInfo/:id', getInfo)

module.exports = Router
