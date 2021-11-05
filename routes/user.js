'use strict';

var Router = require('koa-router');
const User = require('../../8887597-chengr5/modules/user');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const dbName = 'website.db'

const router = new Router()

/**
 * redirect to the The home page.
 * 
 * @name FirstStart Page
 * @route {GET} /
 */
router.get('/', async ctx => {return ctx.redirect('/FirstStart')})

/**
 * Go to the The home page.
 * 
 * @name FirstStart Page
 * @route {GET} /
 */
router.get('/FirstStart', async ctx => await ctx.render('FirstStart'))


/**
 * The user registration page.
 *
 * @name UserRegister Page
 * @route {GET} /register
 */
router.get('/userRegister', async ctx => await ctx.render('userRegister'))

/**
 * The recieve the new user info for the  Register Page.
 *
 * @name UserRegister page
 * @route {POST} /register
 * @param {const} body body is whole info of register info.
 * @param {const} user user is class of user .
 * @description register() to put a new user info into the database to create a new user.
 */
router.post('/userRegister', koaBody, async ctx => {
	try {

		// extract the data from the request
		const body = ctx.request.body
		console.log(body)

		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
//


/**
 * The Go to the userLogin Page.
 *
 * @name UserLogin page
 * @route {GET} /
 */
router.get('/userLogin', async ctx => { 
	console.log('we got login page')
	await ctx.render('userLogin')
})


/**
 * The recive the user login infor from userLogin Page.
 *
 * @name UserLogin page
 * @route {POST} /
 * @param {const} body body is whole info of UserLogin Page.
 * @param {const} user user is class of user .
 * @authentication This route create the user authentication.
 * @description user.login() is check the user info.
 * 
*/
// * @authentication This route requires cookie-based authentication.
router.post('/userLogin', async ctx => {
	try {
		console.log('test the userLogin fucniton')
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised ='user'
		ctx.session.username = body.user
		console.log('test the userLogin fucniton go to the home page ///////////////')
		return ctx.redirect('/HomePage/1')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


/**
 * Logout and go to the FirstStartPage.
 *
 * @name Logout page
 * @route {GET} /
 * @authentication This route cancle the user authentication.
 * 
*/

router.get('/logout', async ctx => {
	ctx.session.authorised = null
		ctx.session.username= null
	ctx.redirect('/?msg=you are now logged out')
})

module.exports = router