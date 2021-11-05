
'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')

module.exports = class LearningContent {

    constructor(dbName = ':memory:') {
        return (async () => {
            this.db = await sqlite.open(dbName)
            // we need this table to store the user accounts
            const sql = 'CREATE TABLE IF NOT EXISTS LearningContent (id INTEGER PRIMARY KEY , content TEXT,  picturePath TEXT);'
            await this.db.run(sql)
            return this
        })()
    }

    async uploadPicture(path, id) {
        try {

            if (id == '')
                throw new Error('Please enter the id')
            else {
                const localPath = `public/avatars/${id}.png`
                await fs.copy(path, localPath)
                const PathForGetPic = `${id}.png`
                return PathForGetPic
            }

        } catch (err) {
            throw err
        }
    }


    //delete the picture in public
    async deletePicture(path) {
        try {
            if (path == '')
                throw new Error('Please enter the path')
            else {
                const localPath = `public/avatars/${path}`

                await fs.unlink(localPath)
                return true
            }
        } catch (err) {
            throw err
        }
    }

    //search the picture path
    async searchPicture(id) {
        try {


            if (id == '')
                throw new Error('Please enter the id')
            else {

                let sql = `SELECT picturePath FROM LearningContent WHERE id=${id};`

                const searchPicturePath = await this.db.get(sql)

                return searchPicturePath.picturePath
            }
        } catch (err) {
            throw err
        }
    }


    async createNewLearningContent(id, content, picturePath) {
        try {
            if (id.length === 0) throw new Error('missing id')
            if (content.length === 0) throw new Error('missing content')
            if (picturePath.length === 0) throw new Error('missing picturePath')
            let sql = `INSERT INTO LearningContent(id,content, picturePath) VALUES("${id}","${content}", "${picturePath}")`
            await this.db.get(sql)
            return true
        } catch (err) {
            throw err
        }
    }


    async getById(id) {

        let sql = `SELECT * FROM LearningContent WHERE id=${id};`
        const data = await this.db.get(sql)
        return data

    }

    async getTheEndofId() {
       

        let sql = ` SELECT id FROM LearningContent
                     WHERE id = (
                SELECT MAX(ID) FROM LearningContent);`
        const data = await this.db.get(sql)

        return data

    }

    async getAllTheContentData() {


        let sql = `SELECT * FROM LearningContent ;`
        const data = await this.db.all(sql)

        return data
    }


    async deleteOneContent(id) {

        let sql = `DELETE FROM LearningContent WHERE id = ${id};`
        await this.db.run(sql)

        return true

    }

    async UpdateOneContent(ID, content, picturePath) {
        try {


            if (ID == '') throw new Error('Please enter the id')

            const id = parseInt(ID)


            let checkId = isNaN(id)

            if (checkId)
                throw new Error('the type of id should be a number')
            else {

                //update without content
                if (content.length === 0) {

                    let sql = `UPDATE LearningContent
                SET  picturePath= '${picturePath}'
                WHERE id = ${id};`
                    await this.db.run(sql)
                }
                else {
                    let sql = `UPDATE LearningContent
                     SET content= '${content}', picturePath= '${picturePath}'
                      WHERE id = ${id};`

                    await this.db.run(sql)
                }

                return true
            }

        } catch (err) {
            throw err
        }
    }

}