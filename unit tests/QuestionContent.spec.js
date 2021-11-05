
'use strict'
jest.mock('fs-extra')

const QuestionContent = require('../modules/QuestionContent.js')


describe('testing  getById(id) funtion ', () => {

  let questionContent
  let data = { "answer": "answer", "content": "content", "id": 1, "option1": "option1", "option2": "option2", "option3": "option3", "option4": "option4", "questionTopic": "questionTopic" }
  beforeEach(async () => {
    questionContent = await new QuestionContent()
    await questionContent.addQuestion('1', 'content', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
  });


  test('test getById(id)', async done => {

    expect.assertions(1)
     expect(await questionContent.getById(1)).
      toEqual(data)
    done()
  })


})



describe('testing  getAllForAdmin(questionTopic)  funtion ', () => {

  let questionContent
  let data = [{ "answer": "answer", "content": "content", "id": 1, "option1": "option1", "option2": "option2", "option3": "option3", "option4": "option4", "questionTopic": "questionTopic" }]
  beforeEach(async () => {
    questionContent = await new QuestionContent()
    await questionContent.addQuestion('1', 'content', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
  });

  test('test getById(id)', async done => {

    expect.assertions(1)
    expect(await questionContent.getAllForAdmin('questionTopic')).
      toEqual(data)
    done()
  })


})


//addQuestion(id,content,option1,option2,option3,option4,answer,questionTopic)




describe('testing  addQuestion  funtion ', () => {

  let questionContent
  let data = { "answer": "answer", "content": "content", "id": 1, "option1": "option1", "option2": "option2", "option3": "option3", "option4": "option4", "questionTopic": "questionTopic" }
  beforeEach(async () => {
    questionContent = await new QuestionContent()
   
  });

  test('test addQuestion', async done => {
   
    expect.assertions(1)
    await questionContent.addQuestion('1', 'content', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
     expect( await questionContent.getById(1)).
      toEqual(data)
    done()

  })

})



describe('testing  get_10_QuestionRandomly function ', () => {

  let questionContent
  beforeEach(async () => {
    questionContent = await new QuestionContent()
    await questionContent.addQuestion('1','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('2','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('3','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('4','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('5','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('6','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('7','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('8','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('9','content','option1','option2','option3','option4','answer','questionTopic')
    await questionContent.addQuestion('10','content','option1','option2','option3','option4','answer','questionTopic')
  });

  test('test cleaning test', async done => {
    expect.assertions(1)
    const datarecieved= await questionContent.get_10_QuestionRandomly('questionTopic')
    await expect(datarecieved.length).
    toEqual(10)
    done()
  })
})


describe('testing  UpdateQuestion funtion ', () => {

  let questionContent
  let data = { "answer": "answer", "content": "newcontent", "id": 1, "option1": "option1", "option2": "option2", "option3": "option3", "option4": "option4", "questionTopic": "questionTopic" }
  beforeEach(async () => {
    questionContent = await new QuestionContent()
   await questionContent.addQuestion('1', 'content', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
   
  });

  test('test UpdateQuestion', async done => {
    expect.assertions(1)
    await questionContent.UpdateQuestion('1', 'newcontent', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
     expect( await questionContent.getById(1)).
      toEqual(data)
    done()

  })

})


describe('testing  getTheEndofQuestionId()  funtion ', () => {

  let questionContent

  beforeEach(async () => {
    questionContent = await new QuestionContent()
   await questionContent.addQuestion('1', 'content', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
   await questionContent.addQuestion('2', 'content', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
   
  });

  test('test getTheEndofQuestionId() ', async done => {
    expect.assertions(1)
    const recievedata = await questionContent.getTheEndofQuestionId()
     expect( recievedata.id).
      toEqual(2)
    done()

  })

})


//deleteOneQuestion(id)
describe('testing deleteOneQuestion(id) funtion ', () => {

  let questionContent
  let data = { "answer": "answer", "content": "newcontent", "id": 1, "option1": "option1", "option2": "option2", "option3": "option3", "option4": "option4", "questionTopic": "questionTopic" }
  beforeEach(async () => {
    questionContent = await new QuestionContent()
   await questionContent.addQuestion('1', 'content', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
   await questionContent.addQuestion('2', 'content', 'option1', 'option2', 'option3', 'option4', 'answer', 'questionTopic')
   
  });

  test('test deleteOneQuestion(id)', async done => {
    expect.assertions(1)
    await questionContent.deleteOneQuestion(2)
    const recievedata=   await questionContent.getAllForAdmin('questionTopic')
     expect( recievedata.length).
      toEqual(1)
    done()

  })

})