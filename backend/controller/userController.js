const { User } = require('../models/aiModels')
const { Company } = require('../models/aiModels')

// Company
const getInfo = async (req, res) => {
    try {
        const data = await Company.findOne({ _id: req.params.id })
        res.json(data)
    }
    catch (e) {
        res.json(e)
    }
}


// User
const getData = async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.params.id })
        res.json(data)
    }
    catch (e) {
        res.json(e)
    }
}

const createReq = async (req, res) => {
    try {
        const newData = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json(response)

    }
    catch (e) {
        console.log(e)
        res.json(e)
    }
}

const getRunId = async (req, res) => {
    try {
        const runId = await new User()
        const response = await runId.save()
        res.json({ runId: runId._id })
        res.end(runId._id)
    }
    catch (e) {
        res.json(e)
    }
}

const createOutput = async (req, res) => {
    try {
        const newData = await User.findOneAndUpdate({ _id: req.params.id }, { $set: { output: req.body.output } }, { new: true })
        res.json(newData)

    }
    catch (e) {
        res.json(e)
    }
}


module.exports = { getData, createReq, getRunId, getInfo, createOutput }
