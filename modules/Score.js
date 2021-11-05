'use strict'

const bcrypt = require('bcrypt-promise')
const mime = require('mime-types')
const sqlite = require('sqlite-async')


module.exports = class ScoreTable {


	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS ScoreTable (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, scores TEXT,questionTopic TEXT, state TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	
    async getAllScoresForUser(username) {
			
			console.log(' getAllScores()//////////////////username',username)	
			let sql = `SELECT * FROM ScoreTable WHERE user= "${username}" ;`
			const data= await this.db.all(sql)
			console.log(' getAllScores()/////////////',data)
			return data
	
	}

	


	async addNewScores(username,scores, questionTopic,state) {
			
			console.log('username???????????????s',username)	
			let sql = `INSERT INTO ScoreTable(user,scores, questionTopic,state) VALUES("${username}", "${scores}", "${questionTopic}", "${state}");`
			const data= await this.db.all(sql)
			console.log(data)
			return data
	
	}

	async getTheEndofScoreId() {

        let sql = ` SELECT id FROM  ScoreTable
                     WHERE id = (
                SELECT MAX(ID) FROM  ScoreTable);`
        const data = await this.db.get(sql)
        console.log(data)
        return data

    }

}
