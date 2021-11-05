
'use strict'

const Admin = require('../modules/admin.js')

describe('test Adminregister() function', () => {



	test('register a valid account', async done => {
		expect.assertions(1)
		const admin = await new Admin()
		const register = await admin.register('doej', 'password')
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate adminname', async done => {
		expect.assertions(1)
		const admin = await new Admin()
		await admin.register('doej', 'password')
		await expect(admin.register('doej', 'password'))
			.rejects.toEqual(Error('adminName "doej" already in use'))
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const admin = await new Admin()
		await expect(admin.register('', 'password'))
			.rejects.toEqual(Error('missing adminrname'))
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const admin = await new Admin()
		await expect(admin.register('doej', ''))
			.rejects.toEqual(Error('missing password'))
		done()
	})

})




describe('test admin login() function ', () => {


	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const admin = await new Admin()
		await admin.register('doej', 'password')
		const valid = await admin.login('doej', 'password')
		expect(valid).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const admin = await new Admin()
		await admin.register('doej', 'password')
		await expect(admin.login('roej', 'password'))
			.rejects.toEqual(Error('adminName "roej" not found'))
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const admin = await new Admin()
		await admin.register('doej', 'password')
		await expect(admin.login('doej', 'bad'))
			.rejects.toEqual(Error('invalid password for account "doej"'))
		done()
	})
})

