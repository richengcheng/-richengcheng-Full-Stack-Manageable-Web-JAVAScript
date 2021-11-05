
'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')
const sqlite = require('sqlite-async')

const width = 800
const height = 600
const delayMS = 5


let browser
let page
let har

// threshold is the difference in pixels before the snapshots dont match
const toMatchImageSnapshot = configureToMatchImageSnapshot({
    customDiffConfig: { threshold: 2 },
    noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
    page = await browser.newPage()
    har = new PuppeteerHar(page)
    await page.setViewport({ width, height })
})

afterAll(() => browser.close()) // https://github.com/GoogleChrome/puppeteer/issues/561



describe('test the firstStart page ', () => {

    test('test the firstStart page', async done => {

        //arrange
        await page.goto('http://localhost:8080/FirstStart', { timeout: 30000, waitUntil: 'load' })
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('FirstStart')//handlebar name

        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })
})



describe('test the userLogin page ', () => {

    test('test the userLogin page', async done => {

        //arrange
        await page.goto('http://localhost:8080/userLogin', { timeout: 30000, waitUntil: 'load' })
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('userLogin')//handlebar name

        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()


        done()
    })
})



describe('test the userRegister page ', () => {

    test('test the userRegister page', async done => {

        //arrange
        await page.goto('http://localhost:8080/userRegister', { timeout: 30000, waitUntil: 'load' })
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('userRegister')//handlebar name

        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()


        done()
    })
})



// test login page before register 
describe('test the adminLogin page before register   ', () => {

    test('test the adminLogin page', async done => {

        //arrange
        await page.goto('http://localhost:8080/adminLogin', { timeout: 30000, waitUntil: 'load' })
        //Act
        await page.type('body > form > p:nth-child(1) > input[type="text"]', 'chengr5')
        await page.type('body > form > p:nth-child(2) > input[type="password"]', 'chengr123')
        await Promise.all([
            page.click('body > form > p:nth-child(3) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('ERROR')//handlebar name

        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()


        done()
    })
})



describe('test the adminRegister page ', () => {

    test('test the adminRegister  page', async done => {

        //arrange
        await page.goto('http://localhost:8080/adminRegister', { timeout: 30000, waitUntil: 'load' })

        //Act
        await page.type('body > form > p:nth-child(1) > input[type="text"]', 'chengr')
        await page.type('body > form > p:nth-child(2) > input[type="password"]', 'chengr123')
        await page.screenshot({ path: 'screenshots/register_after_input.png' })
        await Promise.all([
            page.click('body > form > p:nth-child(3) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        //go to this page
        expect(title).toBe('ERROR')//handlebar name

        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()


        done()
    })
})




describe('test the adminLogin page ', () => {

    test('test the adminLogin page', async done => {

        //arrange
        await page.goto('http://localhost:8080/adminLogin', { timeout: 30000, waitUntil: 'load' })
        //Act
        await page.type('body > form > p:nth-child(1) > input[type="text"]', 'chengr')
        await page.type('body > form > p:nth-child(2) > input[type="password"]', 'chengr123')
        await Promise.all([
            page.click('body > form > p:nth-child(3) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('adminPage')//handlebar name

        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()

        done()
    })
})


describe('test the create learning content page in adminpage ', () => {

    test('test the create learning content page in adminpage ', async done => {

        //arrange
        await page.goto('http://localhost:8080/adminLearningContentEdit/0', { timeout: 30000, waitUntil: 'load' })
        //Act

        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('Learning Content Edit')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })
})





//  await page.type('body > div:nth-child(8) > form > textarea','')
//  const fileInput= await page.$('body > div:nth-child(10) > form > input[type="file"]:nth-child(2)')
//    const filePath = path.relative(process.cwd(),`${__dirname}/assets/questionPic.png`)
//   await fileInput.uploadFile(filePath)
//body > div:nth-child(10) > form > input[type="file"]:nth-child(2)
//  await page.click('body > div:nth-child(11) > form > input[type="file"]:nth-child(2)','1.png')
describe('test the create learning content page in adminpage ', () => {
    test('test the create learning content page in adminpage ', async done => {
        //arrange
        await page.goto('http://localhost:8080/adminPage', { timeout: 30000, waitUntil: 'load' })
        //Act            body > div:nth-child(8) > form > textarea

        await Promise.all([
            page.click('body > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(4) > a'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('Learning Content Edit')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })
})


describe('test the adminQuestionContentEdit page ', () => {
	test('test the adminQuestionContentEdit page ', async done => {
        //arrange
        await page.goto('http://localhost:8080/adminPage', { timeout: 30000, waitUntil: 'load' })
        //Act            body > div:nth-child(8) > form > textarea
   
        await Promise.all([
            page.click('body > div:nth-child(5) > div > table > tbody > tr:nth-child(2) > td:nth-child(8) > a'),
            page.waitForNavigation({ waitUntil:'networkidle0'}),
        ])
        
		// ASSERT
		const title = await page.title() //title is handlebar title
        expect(title).toBe('adminQuestionContentEdit')//handlebar name
        const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		done()
	})
})





// start user function 
describe('test the user login first ', () => {

    test('test the user login page ', async done => {

        //arrange
        await page.goto('http://localhost:8080/userLogin', { timeout: 30000, waitUntil: 'load' })
        //Act

        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('userLogin')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })


    test('test the user login before register ', async done => {

        //arrange
        await page.goto('http://localhost:8080/userLogin', { timeout: 30000, waitUntil: 'load' })
        //Act
        await page.type('body > form > p:nth-child(1) > input[type="text"]', 'chengr5')
        await page.type('body > form > p:nth-child(2) > input[type="password"]', 'chengr123')
        await Promise.all([
            page.click('body > form > p:nth-child(3) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('ERROR')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })



    test('test the user login page to  register page', async done => {

        //arrange
        await page.goto('http://localhost:8080/userLogin', { timeout: 30000, waitUntil: 'load' })
        //Act
        await Promise.all([
            page.click('body > p:nth-child(4) > a'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('userRegister')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })

})


describe('test the user register  ', () => {

    test('test the user login before register ', async done => {

        //arrange
        await page.goto('http://localhost:8080/userRegister', { timeout: 30000, waitUntil: 'load' })
        //Act
        await page.type('body > form > p:nth-child(1) > input[type="text"]', 'chengr')
        await page.type('body > form > p:nth-child(2) > input[type="password"]', 'chengr123')
        await Promise.all([
            page.click('body > form > p:nth-child(3) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('ERROR')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })

})




// start user function 
describe('test the HomePage ', () => {
    test('go to he home page ', async done => {
        //arrange
        await page.goto('http://localhost:8080/userLogin', { timeout: 30000, waitUntil: 'load' })
        //Act
        await page.type('body > form > p:nth-child(1) > input[type="text"]', 'chengr')
        await page.type('body > form > p:nth-child(2) > input[type="password"]', 'chengr123')
        await Promise.all([
            page.click('body > form > p:nth-child(3) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('HomePage')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })

    test(' go to the next HomePage ', async done => {
        //arrange
        await page.goto('http://localhost:8080/HomePage/1', { timeout: 30000, waitUntil: 'load' })
        //Act
        await Promise.all([
            page.click('#menu > form > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('HomePage')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })

    test(' go to the pre HomePage ', async done => {
        //arrange
        await page.goto('http://localhost:8080/HomePage/2', { timeout: 30000, waitUntil: 'load' })
        //Act
        await Promise.all([
            page.click('#menu > form:nth-child(7) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('HomePage')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })

    test(' go to the question branch  ', async done => {
        //arrange
        await page.goto('http://localhost:8080/HomePage/1', { timeout: 30000, waitUntil: 'load' })
        //Act
        await Promise.all([
            page.click('body > p > a'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        const title = await page.title() //title is handlebar title
        expect(title).toBe('questionChoicePage')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()
        done()
    })


})




describe('test the question branch  1 2  ', () => {

    test('test the question branch   ', async done => {

        //arrange
        await page.goto('http://localhost:8080/questionPage', { timeout: 30000, waitUntil: 'load' })
        //Act
        await Promise.all([
            page.click('body > p:nth-child(2) > a'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])
        // ASSERT
        let title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        const image = await page.screenshot()
        // compare to the screenshot from the previous test run
        expect(image).toMatchImageSnapshot()


        //question 1
        //body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]
        await page.click('body > form > label:nth-child(4) > input[type="radio"]')
        await Promise.all([
            // body > form:nth-child(5) > input[type="submit"]
            page.click('body > form > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()


        //question 2

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()

        done()
    })




    test('test the question branch 3 4   ', async done => {
        const image = await page.screenshot()

        //question 3

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        let title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()

        //question 4

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()


        done()
    })


    test('test the question branch  5 6  ', async done => {

        const image = await page.screenshot()


        //question 5

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        let title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()


        //question 6

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()

        done()
    })




    test('test the question branch  7 8  ', async done => {
        const image = await page.screenshot()

        //question 7

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        let title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()


        //question 8

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()

        done()
    })


    test('test the question branch  9 10 and finish  ', async done => {
        const image = await page.screenshot()


        //question 9

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        let title = await page.title() //title is handlebar title
        expect(title).toBe('questionPage')//handlebar name
        expect(image).toMatchImageSnapshot()


        //question 10

        await page.click('body > form:nth-child(5) > label:nth-child(4) > input[type="radio"]')
        await Promise.all([

            page.click('body > form:nth-child(5) > input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ])

        title = await page.title() //title is handlebar title
        expect(title).toBe('questionFinalPage')//handlebar name
        expect(image).toMatchImageSnapshot()

        done()
    })




})

