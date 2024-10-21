const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('thoughts2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate()
    console.log('Conectamos com sucesso!')
} catch(err) {
    console.log('Conexão não sucedida')
}

module.exports = sequelize