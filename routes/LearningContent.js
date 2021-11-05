'use strict';

var Router = require('koa-router');
const LearningContent = require('../../8887597-chengr5/modules/LearningContent');
const ScoresTable = require('../../8887597-chengr5/modules/Score');
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' })
const dbName = 'website.db'
const router = new Router()


/**
 * The recieve the new user info for the  Register Page.
 *
 * @name UserRegister page
 * @route {GET} /register
 * @param {const} body body is whole info of register info.
 * @param {const} user user is class of user .
 * @description register() to put a new user info into the database to create a new user.
 */

router.get('/HomePage/:id', async ctx => {
    try {
        if (ctx.params.id == 'style.css') {
        }
        else {
            if (ctx.session.authorised !== 'user') {
                throw new Error('you need to login first')
            }
            else {
                console.log('URL ------------> ' + ctx.request.url)
                console.log('test the HomePage fucniton')
                const id = parseInt(ctx.params.id)
                console.log('id', id)

                var nextPageChecking = id
                var prePageChecking = id

                //get akk scores
                const scoresTable = await new ScoresTable(dbName)
                const Score = await scoresTable.getAllScoresForUser(ctx.session.username)
                console.log('Score/////////////////////', Score)

                const learningContent = await new LearningContent(dbName)
                console.log(id)
                const data = await learningContent.getById(parseInt(id))

                console.log(data)
                const TheEndofId = await learningContent.getTheEndofId()
                console.log('1111TheEndofId', TheEndofId.id)

                if (TheEndofId.id === id) {
                    nextPageChecking = 0
                } else {
                    nextPageChecking = nextPageChecking + 1
                }
                prePageChecking = prePageChecking - 1
                await ctx.render('HomePage', { content: data.content, prePageChecking: prePageChecking, nextPageChecking: nextPageChecking, picturePath: data.picturePath, Score: Score })
            }
        }
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})



module.exports = router