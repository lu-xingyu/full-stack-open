const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/reset')
    await request.post('/api/users', {
      data: {
        username: "Goodie",
        name: "Teddy",
        password: "goodluck"
      }
    })

    await request.post('/api/users', {
      data: {
        username: "devil",
        name: "Gabel",
        password: "adventure"
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText("log in to application")).toBeVisible()
    await expect(page.getByRole('textbox', {name: 'username'})).toBeVisible()
    await expect(page.getByRole('textbox', {name: 'password'})).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      loginWith(page, "Goodie", "goodluck")
      await expect(page.getByText("Goodie logged in")).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      loginWith(page, "Goodie", "wrong")
      await expect(page.getByText("wrong credentials")).toBeVisible()  
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, "Goodie", "goodluck")
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', {name: "create new blog"}).click()
      createBlog(page, "This is a new Blog", "Amy Ducan", 'https://fake.link.com')
      await expect(page.getByText('This is a new Blog')).toBeVisible() 
    })

    describe('When there are blogs', () => {
      beforeEach( async ({ page }) => {
        await page.getByRole('button', {name: "create new blog"}).click()
        createBlog(page, "first blog", "Amy Ducan", 'https://fake.link1.com')
        createBlog(page, "second blog", "Teddy Ducan", 'https://fake.link2.com')
        createBlog(page, "third", "Teddy Ducan", 'https://fake.link3.com')
      })

      test('the blog can be liked', async ({page}) => {
        const toLike = page.locator('li').filter({ hasText: 'second blog' })
        await toLike.getByRole('button', {name: 'like'}).click()
        await expect(toLike.getByText('likes 2')).toBeVisible() 
      })

    })
  })


})