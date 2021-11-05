
'use strict'
jest.mock('fs-extra')

const LearningContent = require('../modules/LearningContent.js')

describe('testing creating a LearningContent  ', () => {

  let learningContent

  beforeEach(async () => {
    learningContent = await new LearningContent()
  });
  
  test('test if lost path', async done => {
    expect.assertions(1)
    await expect(learningContent.createNewLearningContent('1', 'book', ''))
      .rejects.toEqual(Error('missing picturePath'))
    done()
  })

  test('test if lost content', async done => {
    expect.assertions(1)
    await expect(learningContent.createNewLearningContent('1', '', 'good'))
      .rejects.toEqual(Error('missing content'))
    done()
  })

  test('test if lost id', async done => {
    expect.assertions(1)
    await expect(learningContent.createNewLearningContent('', 'book', 'good'))
      .rejects.toEqual(Error('missing id'))
    done()
  })

  test('test if it is true', async done => {
    expect.assertions(1)
    const TestlearningContent = await learningContent.createNewLearningContent('1', 'book', 'good')
    expect(TestlearningContent).toBe(true)
    done()
  })

})


describe('Test the learningContent part that is getById()', () => {

  test('test getById funciton ', async done => {
    expect.assertions(3)
    const id = parseInt('1')
    const learningContent = await new LearningContent()
    await learningContent.createNewLearningContent('1', 'book', 'good')
    const learningContentTest = await learningContent.getById(id)
    expect(learningContentTest.content)
      .toEqual("book")
    expect(learningContentTest.picturePath)
      .toEqual("good")
    expect(learningContentTest.id)
      .toEqual(1)
    done()
  })

})

describe('Test the learningContent part that is getTheEndofId()', () => {

  test('test getTheEndofID() funciton ', async done => {
    expect.assertions(1)
    const learningContent = await new LearningContent()
    await learningContent.createNewLearningContent('1', 'book', 'good')
    const learningContentTest = await learningContent.getTheEndofId()
    expect(learningContentTest.id)
      .toEqual(1)
    done()
  })
})


describe('Test the learningContent part that is getAllTheContentData()', () => {

  test('test getAllTheContentData() funciton ', async done => {
    expect.assertions(1)
    const learningContent = await new LearningContent()
    await learningContent.createNewLearningContent('1', 'book', 'good')
    await learningContent.createNewLearningContent('2', 'book2', 'good2')
    const learningContentTest = await learningContent.getAllTheContentData()
    expect(learningContentTest.length)
      .toEqual(2)
    done()
  })
})



describe('Test the learningContent part that is deleteOneContent()', () => {

  test('test deleteOneContent() funciton ', async done => {
    expect.assertions(1)
    const learningContent = await new LearningContent()
    await learningContent.createNewLearningContent('1', 'book', 'good')
    await learningContent.createNewLearningContent('2', 'book2', 'good2')
    await learningContent.deleteOneContent(1)
    const learningContentTest = await learningContent.getAllTheContentData()

    expect(learningContentTest.length)
      .toEqual(1)
    done()
  })
})


describe('testing update a LearningContent  ', () => {

  let learningContent
  beforeEach(async () => {
    learningContent = await new LearningContent()
    await learningContent.createNewLearningContent('1', 'book111', 'good')
  });

  test(' update  a  content of LearningContent ', async done => {
    expect.assertions(1)
    //await learningContent.createNewLearningContent('1','book111', 'good')
    await learningContent.UpdateOneContent('1', 'books', 'good')
    const learningContentTest = await learningContent.getById(1)
    await expect(learningContentTest.content)
      .toEqual("books")
    done()
  })


  test('update  a  picturePath of LearningContent  ', async done => {
    expect.assertions(1)
    await learningContent.UpdateOneContent('1', 'book', 'goods')
    const learningContentTest = await learningContent.getById(1)
    await expect(learningContentTest.picturePath)
      .toEqual("goods")
    done()
  })


  test('if i do not update a  content of LearningContent  ', async done => {
    expect.assertions(2)
    await learningContent.UpdateOneContent('1', '', 'goods')
    const learningContentTest = await learningContent.getById(1)
    await expect(learningContentTest.content)
      .toEqual("book111")
    await expect(learningContentTest.picturePath)
      .toEqual("goods")
    done()
  })

  test('if  input id that is not a number when update a LearningContent  ', async done => {
    expect.assertions(1)
    await expect(learningContent.UpdateOneContent('f', '', 'goods'))
      .rejects.toEqual( Error('the type of id should be a number'))
    done()
  })

  test('if  input id that is null  when update a LearningContent  ', async done => {
    expect.assertions(1)
    await expect(learningContent.UpdateOneContent('','', 'goods'))
      .rejects.toEqual( Error('Please enter the id'))
    done()
  })

})


describe('Test uploadPicture function', () => {



  let learningContent

  beforeEach(async () => {
    learningContent = await new LearningContent()
  });

  test('test uploadPicture function with id ', async done => {
 
    expect.assertions(1)
    expect(  await learningContent.uploadPicture('11111', 1))
      .toEqual('1.png')
    done()
  })

  test('test uploadPicture function without id ', async done => {

    expect.assertions(1)
    await expect( learningContent.uploadPicture('1', ''))
      .rejects.toEqual(Error('Please enter the id'))
    done()
  })
})



describe('Test deletePicture function', () => {

  let learningContent
  beforeEach(async () => {
    learningContent = await new LearningContent()
  });

  test('test deletePicture function with path ', async done => {
    expect.assertions(1)    
    expect(  await learningContent. deletePicture('1234'))
      .toEqual(true)
    done()
  })

  test('test deletePicture function without path ', async done => {
    expect.assertions(1)   
    await expect(learningContent. deletePicture(''))
    .rejects.toEqual(  Error('Please enter the path'))
    done()
  })

})




describe('Test searchPicture function', () => {

  let learningContent
  beforeEach(async () => {
    learningContent = await new LearningContent()
    await learningContent.createNewLearningContent('1', 'book111', 'good') 
  });

  test('test searchPicture function with id ', async done => {
    expect.assertions(1)   
    expect(  await learningContent.searchPicture(1))
      .toEqual("good")
    done()
  })
  test('test searchPicture function with out  ', async done => {
    expect.assertions(1)   
    await expect(learningContent.searchPicture(''))
    .rejects.toEqual( Error('Please enter the id'))
    done()
  })
 
})




