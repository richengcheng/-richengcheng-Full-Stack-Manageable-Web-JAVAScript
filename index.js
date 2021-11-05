#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
//const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */////
/*************************** */
const user = require('./routes/user')
const admin = require('./routes/admin')
const LearningContent=require('./routes/LearningContent')
const QuestionContent=require('./routes/QuestionContent')

const app = new Koa()
//const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort
//const dbName = 'website.db'


app.use(LearningContent.routes())
app.use(user.routes())
app.use(admin.routes())
app.use(QuestionContent.routes())

//app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
