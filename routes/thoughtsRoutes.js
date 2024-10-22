const express = require('express')
const Thought = require('../models/Thought')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtsController')

router.get('/', ThoughtsController.showThoughts)

module.exports = router