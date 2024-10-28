const { result } = require('lodash')
const Thought = require('../models/Thought')
const User = require('../models/User')

module.exports = class ThoughtsController {
    static async showThoughts(req, res) {
        res.render('thoughts/home')
    }

    static async dashboard(req, res) {
        const userId = req.session.userId

        const user = await User.findOne({ 
            where: { 
                id: userId, 
            },
            include: Thought,
            plain: true,
        })

        if(!user) {
            res.redirect('/login')
        }

        const thoughts = user.Thoughts.map((result) => result.dataValues)

        res.render('thoughts/dashboard', { thoughts })
    }

    static createThought(req, res) {
        res.render('thoughts/create')
    }

    static async postThought(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userId
        }

        try {
            await Thought.create(thought)

            req.flash('message', 'Pensamento criado!')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

}