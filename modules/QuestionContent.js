
'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')


module.exports = class QuestionContent {



    constructor(dbName = ':memory:') {
        return (async () => {
            this.db = await sqlite.open(dbName)
            // we need this table to store the user accounts
            const sql = 'CREATE TABLE IF NOT EXISTS QuestionContent (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, option1 TEXT,option2 TEXT,option3 TEXT,option4 TEXT, answer TEXT, questionTopic TEXT);'
            await this.db.run(sql)
            return this
        })()
    }



    async get_10_QuestionRandomly(questionTopic) {
        

            console.log('get_10_QuestionRandomly()')
            let sql = ` SELECT * FROM  QuestionContent where questionTopic = "${questionTopic}" ORDER BY RANDOM() limit 10`

            let data2 = await this.db.all(sql)

            console.log('get_10_QuestionRandomly') 

            return data2
       
    }




    async getById(id) {
        
            let sql = `SELECT * FROM QuestionContent WHERE id=${id};`
            const data = await this.db.get(sql)
            return data
      
    }



    async getAllForAdmin(questionTopic) {
        
            let sql = `SELECT * FROM QuestionContent WHERE  questionTopic = "${questionTopic}" ;`
            const data = await this.db.all(sql)
            return data
        
    }

    
    async addQuestion(id,content,option1,option2,option3,option4,answer,questionTopic) {
       
            let sql = `INSERT INTO QuestionContent (id,content,option1,option2,option3,option4,answer,questionTopic)
             VALUES("${id}","${content}", "${option1}" , "${option2}", "${option3}", "${option4}", "${answer}", "${questionTopic}");`
             await this.db.run(sql)
           
       
    }

    async UpdateQuestion(id,content,option1,option2,option3,option4,answer) {
        


            let sql = `UPDATE QuestionContent  SET content = "${content}", option1 ="${option1}", option2= "${option2}",option3= "${option3}",
            option4 = "${option4}",answer="${answer}"  WHERE id = ${id};`
            const data = await this.db.all(sql)
            return data
        
    }

    async getTheEndofQuestionId() {

        let sql = ` SELECT id FROM  QuestionContent
                     WHERE id = (
                SELECT MAX(ID) FROM  QuestionContent);`
        const data = await this.db.get(sql)
        console.log(data)
        return data

    }

    async deleteOneQuestion(id) {

        let sql = `DELETE FROM QuestionContent WHERE id = ${id};`
        await this.db.run(sql)
        return true

    }


}