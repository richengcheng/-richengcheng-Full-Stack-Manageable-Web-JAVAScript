'use strict'

const bcrypt = require('bcrypt-promise')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Admin {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, admin TEXT, pass TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async register(admin, pass) {
		try {
			if(admin.length === 0) throw new Error('missing adminrname')
			if(pass.length === 0) throw new Error('missing password')
			let sql = `SELECT COUNT(id) as records FROM admins WHERE admin="${admin}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`adminName "${admin}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO admins(admin, pass) VALUES("${admin}", "${pass}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async login(adminName, password) {
		try {
			let sql = `SELECT count(id) AS count FROM admins WHERE admin="${adminName}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`adminName "${adminName}" not found`)
			sql = `SELECT pass FROM admins WHERE admin = "${adminName}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${adminName}"`)
			return true
		} catch(err) {
			throw err
		}
    }	

}
