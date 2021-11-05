
'use strict'

const Score = require('../modules/Score.js')

describe('test addNewScores() and getAllScoresForUser function ', () => {

	test('test addNewScores() and getAllScoresForUser function', async done => {
        expect.assertions(1)
        let data = [{"id": 1, "questionTopic": "questionTopic", "scores": "scores", "state": "state", "user": "username"}]
        const score  = await new Score ()
        await score.addNewScores('username','scores','questionTopic','state')
        
		expect(await score.getAllScoresForUser('username')).toEqual(data)
		done()
	})

})


describe('test getTheEndofScoreId() function ', () => {

	test('test getTheEndofScoreId() function', async done => {
        expect.assertions(1)
        const score  = await new Score ()
        await score.addNewScores('username','scores','questionTopic','state')
        await score.addNewScores('username','scores','questionTopic','state')
        const recieveData= await score.getTheEndofScoreId()
		expect(recieveData.id).toEqual(2)
		done()
	})

})

