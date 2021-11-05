'use strict';

var Router = require('koa-router');
const Admin = require('../../8887597-chengr5/modules/admin');
const LearningContent = require('../../8887597-chengr5/modules/LearningContent');
const QuestionContent = require('../../8887597-chengr5/modules/QuestionContent');
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' })

const dbName = 'website.db'

const router = new Router()


/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */

router.get('/', async ctx => {
    try {
        //we have to put question mark near the login, which is grammer
        if (ctx.session.authorised !== true)
            return ctx.redirect('/FirstStart')//?msg=you need to log in hahhahh i am richichi'
        const data = {}
        if (ctx.query.msg) data.msg = ctx.query.msg
        await ctx.render('FirstStart')
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})

router.get('/FirstStart', async ctx => await ctx.render('FirstStart'))
/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/adminRegister', async ctx => await ctx.render('adminRegister'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/adminRegister', koaBody, async ctx => {
    try {
        // extract the data from the request
        const body = ctx.request.body
        console.log(body)
        // call the functions in the module
        const admin = await new Admin(dbName)
        await admin.register(body.admin, body.pass)

        // await user.uploadPicture(path, type)
        // redirect to the home page
        ctx.redirect(`/?msg=new admin "${body.name}" added`)
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})
//


//show the  admin login page 
router.get('/adminLogin', async ctx => {
    console.log('log in admin perpare')
   
    await ctx.render('adminLogin')
})


//login 
router.post('/adminLogin', async ctx => {
    try {
        console.log('log in adminPage post and real adminPage')
        const body = ctx.request.body
        const admin = await new Admin(dbName)
        await admin.login(body.admin, body.pass)
        ctx.session.authorised = 'admin'
        return ctx.redirect('/adminPage')
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})


router.get('/adminPage', async ctx => {
    try {
        if (ctx.session.authorised !== 'admin') {
              throw new Error('you need to login first and only admin can use it ')
        }
        else {
            console.log('i get finally adminPage post and real adminPage')
            const learningContent = await new LearningContent(dbName)
            const data = await learningContent.getAllTheContentData()
            const questionContent = await new QuestionContent(dbName)
            const mathQuestion = await questionContent.getAllForAdmin('math')
            console.log('/////////////mathQuestion= ', mathQuestion)
            const hTML5Question = await questionContent.getAllForAdmin('html5')
            console.log('/////////////hTML5Question= ', hTML5Question)
            await ctx.render('adminPage', { contents: data, HTML5Question: hTML5Question, MathQuestion: mathQuestion })
        }

    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})



//this function  show the  adminLearningContentEdit page details 
router.get('/adminLearningContentEdit/:id', async ctx => {
    try {
        const id=ctx.params.id
        if(id==0){ return ctx.render('adminLearningContentEdit',{id:'0'})}
        else{
        
        console.log('adminLearningContentEdit/:id')
        const learningContent = await new LearningContent(dbName)
        const data= await learningContent.getById(id)
        return ctx.render('adminLearningContentEdit',{id:data.id, content:data.content,picturePath:data.picturePath, })
        }
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})


//this function  show the  adminQuestionContentEdit page details 
router.get('/EditingQuestion/:id', async ctx => {
    try {
        const id=ctx.params.id
        console.log('EditingQuestion/:id')
        const questionContent = await new QuestionContent(dbName)
        const data= await questionContent.getById(id)
        return ctx.render('adminQuestionContentEdit',{id:data.id ,questionTopic:data.questionTopic, Questioncontent:data.content,option1:data.option1, option2:data.option2, option3:data.option3,
            option4:data.option4, answer:data.answer })
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})


// this part for admin operations
router.get('/delete/:id', async ctx => {
    try {
        const id = parseInt(ctx.params.id)
        const learningContent = await new LearningContent(dbName)
        //get the pick path first
        const Exsitpicture = await learningContent.searchPicture(id)
        console.log('Exsitpicture/////////////= ', Exsitpicture)
        //delete the picture in public as well
        await learningContent.deletePicture(Exsitpicture)
        //delete the learning content in the Learningcontent DB 
        await learningContent.deleteOneContent(id)

        return ctx.redirect('/adminPage')

    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})



//start to add new page
router.post('/addNewContent/:id', koaBody, async ctx => {
    try {
        const id=ctx.params.id
        console.log('id= ',id)
        const body = ctx.request.body
        console.log(body)
        console.log('ctx.request.body.content=', ctx.request.body.content)
        const path = ctx.request.files.avatar.path
        console.log('path=', path)

        const learningContent = await new LearningContent(dbName)
        //store the picture into the public

        let ID = await learningContent.getTheEndofId()
        if(ID==undefined) 
        ID=1
        else
        // have to use ID.id because what i got from database is array
        ID = parseInt(ID.id) + 1

        console.log('ID //////////////= ', ID)
        const storedPath = await learningContent.uploadPicture(path, ID)

        const data = await learningContent.createNewLearningContent(ID, body.content, storedPath)
        console.log(data)
        return ctx.redirect('/adminPage')

    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})


router.post('/UpdateAccount/:id', koaBody, async ctx => {
    try {
        const id = ctx.params.id
        const body = ctx.request.body
        console.log(body)

        const path = ctx.request.files.avatar.path
        console.log(path)
        var filedocument = ctx.request.files
        console.log('filedocument', filedocument)

      
        const learningContent = await new LearningContent(dbName)
      
        //delete the original picture first 
        const DeleteTheOriginlPicture = await learningContent.searchPicture(id)
        await learningContent.deletePicture(DeleteTheOriginlPicture)

        //store the new picture into the public
        const storedPath = await learningContent.uploadPicture(path, id)
        //update the learning content data

        const data = await learningContent.UpdateOneContent(id, body.content, storedPath)
        console.log(data)
        return ctx.redirect('/adminPage')

    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})



// this function is go to the  adminLearningContentEdit page 
router.get('/EditLearningContent/:id', async ctx => {
    try {
        
        const goTo_adminLearningContentEdit = '/adminLearningContentEdit/' + ctx.params.id
        console.log('EditLearningContent/:id')

        return ctx.redirect(goTo_adminLearningContentEdit)

    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})



router.post('/addQuesiton/:id', koaBody, async ctx => {
    try {       // if the  ctx.params.id is wrong
        if (ctx.params.id == 'style.css') {
        } else {

            //check the login 
            if (ctx.session.authorised !== 'admin') {
                throw new Error('you need to login first and this function only for admin')
            } else {
                const RecieveQuestion = ctx.request.body
                console.log('///////RecieveQuestion=', RecieveQuestion)
                const questionContent = await new QuestionContent(dbName)
                const currentQuestion = await questionContent.getById(ctx.params.id)
                console.log('///////currentQuestion=', currentQuestion)
                let TheEndOfQuestionID = await questionContent.getTheEndofQuestionId()
                console.log('///////TheEndOfQuestionID =', TheEndOfQuestionID)
                TheEndOfQuestionID = parseInt(TheEndOfQuestionID.id) + 1
                console.log('///////TheEndOfQuestionID2 =', TheEndOfQuestionID)
                await questionContent.addQuestion(TheEndOfQuestionID, RecieveQuestion.content, RecieveQuestion.option1,
                    RecieveQuestion.option2, RecieveQuestion.option3, RecieveQuestion.option4, RecieveQuestion.answer, currentQuestion.questionTopic)

                await ctx.redirect('/adminPage')
            }
        }
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})



router.post('/updateQuestion/:id', koaBody, async ctx => {
    try {
        console.log('/pdateQuesiton/:id=')
        // if the  ctx.params.id is wrong
        if (ctx.params.id == 'style.css') {
            console.log('/pdateQuesiton/:id=')
        } else {

            //check the login 
            if (ctx.session.authorised !== 'admin') {
                throw new Error('you need to login first and this function only for admin')
            } else {
                const RecieveQuestion = ctx.request.body
                console.log('///////RecieveQuestion=', RecieveQuestion)
                const questionContent = await new QuestionContent(dbName)
                await questionContent.UpdateQuestion(ctx.params.id, RecieveQuestion.content, RecieveQuestion.option1,
                    RecieveQuestion.option2, RecieveQuestion.option3, RecieveQuestion.option4, RecieveQuestion.answer)

                await ctx.redirect('/adminPage')
            }
        }
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})


router.get('/deleteQuestion/:id', async ctx => {
    try {       // if the  ctx.params.id is wrong
        if (ctx.params.id == 'style.css') {
        } else {
            //check the login 
            if (ctx.session.authorised !== 'admin') {
                throw new Error('you need to login first and this function only for admin')
            } else {
                const questionContent = await new QuestionContent(dbName)
                await questionContent.deleteOneQuestion(ctx.params.id)
                await ctx.redirect('/adminPage')
            }
        }
    } catch (err) {
        await ctx.render('error', { message: err.message })
    }
})

module.exports = router