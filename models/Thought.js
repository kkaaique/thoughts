const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Thought = db.define('Thought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})

module.exports = Thought

Thought.belongsTo(User)
User.hasMany(Thought)