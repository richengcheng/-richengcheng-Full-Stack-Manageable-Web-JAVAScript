'use strict';
var Router = require('koa-router');
const QuestionContent = require('../../8887597-chengr5/modules/QuestionContent');
const ScoresTable = require('../../8887597-chengr5/modules/Score');
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' })

const dbName = 'website.db'
let data
let id
let nextPageChecking
let prePageChecking
let listOfQuestions
let scores = new Array()
const router = new Router()


//show the  admin login page 
router.get('/questionChoicePage/:id', async ctx => {
    console.log('URL -------------------------------11------------> ' + ctx.request.url)
    console.log('testing  questionPage/:questiontopic first step')
    const questionTopic = ctx.params.id
    console.log('testing questionTopic ////////', questionTopic)
    const questionContent = await new QuestionContent(dbName)
    //clean the content question table first
    console.log('testing  questionPage 2 step')
    listOfQuestions = await questionContent.get_10_QuestionRandomly(questionTopic)
    return ctx.redirect('/questionPage/1')
})


router.get('/questionPage', async ctx => {
    //questionChoicePage
    await ctx.render('questionChoicePage')
})
//get the question info from the question page
router.post('/questionPage/:id', koaBody, async ctx => {
    try {
        console.log('URL ----------------3333---------------------------> ' + ctx.request.url)
        var ReturnForError = parseInt(ctx.params.id) - 1
        var SendError = '/questionPage/' + ReturnForError

        scores[ReturnForError - 1] = 0

        //if finish the question branch calculate the scores
        if (ctx.params.id == 11) {
            let finialScores = 0
            const scoresTable = await new ScoresTable(dbName)
            for (let i = 0; i < scores.length; i++) {

                finialScores = finialScores + scores[i]
                console.log('i= ', i, 'scores[i] ', scores[i])
            }

            let state = 'pass'
            if (finialScores < 40)
                state = 'fail'
            console.log('ctx.session.username', ctx.session.username, 'finialScores', finialScores, 'data.questionTopi', data.questionTopic, 'state', state)
            //input data into the scores table
            const UserName = ctx.session.username
            console.log('UserName888888888222', UserName)
            await scoresTable.addNewScores( UserName, finialScores, data.questionTopic, state)

            await ctx.render('questionFinalPage', { scores: finialScores, state: state })
        } else {
            if (ctx.request.body.option === undefined) {
                throw new Error('Please choose the answer first before next question')
            }
            else {
                const option = ctx.request.body.option
                console.log('//answer is =', option)
                console.log('////////////////////id is =', ctx.params.id)
                var nextPageCheckingInPost = ctx.params.id
                var redirectPage = '/questionPage/' + nextPageCheckingInPost
                console.log('///////////////////redirectPage', redirectPage)

                //calculate the socres for question 
                if (option == data.answer) {
                    scores[ReturnForError - 1] = 10
                }
                console.log('option', option, 'data.answer', data.answer, '////scores[ReturnForError-1]=', scores[ReturnForError - 1])
                return ctx.redirect(redirectPage)
                //questionFinalPage
            }
        }
    } catch (err) {
        await ctx.render('questionPage', {
            message: err.message, option1: data.option1, id: data.id, content: data.content, option2: data.option2, option3: data.option3,
            option4: data.option4, prePageChecking: prePageChecking, nextPageChecking: nextPageChecking, questionNumber: id
        })
        //  redirect('/?msg=you are now logged out')
    }
})


//show the question page
router.get('/questionPage/:id', async ctx => {
    try {       // if the  ctx.params.id is wrong
        if (ctx.params.id == 'style.css') {
        } else {

            //check the login 
            if (ctx.session.authorised !== 'user') {
                throw new Error('you need to login first')
            } else {
                console.log('URL --------------------222222-----------------------> ' + ctx.request.url)
                console.log('test the questionPage fucniton')
                id = parseInt(ctx.params.id)
                nextPageChecking = id
                //only for string because in post function i need to use it 
                prePageChecking = id
                console.log(`nextPageChecking FIRST ${nextPageChecking}`)
                data = listOfQuestions[id - 1]
                console.log('listOfQuestions[id-1]', data)
                // console.log(data)
                const TheEndofId = 11
                console.log('1111TheEndofId', TheEndofId)
                if (TheEndofId === id) {
                    nextPageChecking = 0
                } else {
                    nextPageChecking = nextPageChecking + 1
                }
                prePageChecking = prePageChecking - 1
                console.log('nextPageChecking', nextPageChecking)
                console.log('prePageChecking', prePageChecking)

                await ctx.render('questionPage', {
                    id: data.id, content: data.content, option1: data.option1, option2: data.option2, option3: data.option3,
                    option4: data.option4, prePageChecking: prePageChecking, nextPageChecking: nextPageChecking, questionNumber: id
                })
            }
        }
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})









module.exports = router