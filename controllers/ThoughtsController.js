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

        let emptyThoughts = false

        if (thoughts.length === 0) {
            emptyThoughts = true
        }
        res.render('thoughts/dashboard', { thoughts, emptyThoughts })
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

    static async removeThought(req, res) {
        const id = req.body.id
        const userId = req.session.userId

        try {
            await Thought.destroy({ where: { id: id, UserId: userId } })
            req.flash('message', 'Pensamento removido com sucesso!')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async updateThought(req, res) {
        const id = req.params.id 

        const thought = await Thought.findOne({ where: { id: id }, raw: true })

        res.render('thoughts/edit', { thought })
    }

    static async updateThoughtSave(req, res) {
        const id = req.body.id
        
        const thought = {
            title: req.body.title,
        }

        try {
            await Thought.update(thought, { where: { id: id }})
            req.flash('message', 'Pensamento atualizado com sucesso!')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }
}