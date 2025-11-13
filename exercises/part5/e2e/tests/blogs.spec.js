const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, findAndLike } = require('./helper')

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
      await loginWith(page, "Goodie", "goodluck")
      await expect(page.getByText("Goodie logged in")).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, "Goodie", "wrong")
      await expect(page.getByText("wrong credentials")).toBeVisible()  
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "Goodie", "goodluck")
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, "This is a new Blog", "Amy Ducan", 'https://fake.link.com')
      const newBlog = page.locator('li', { hasText: "This is a new Blog" })
      await expect(newBlog).toBeVisible() 
    })

    describe('When there are blogs', () => {
      beforeEach( async ({ page }) => {
        await createBlog(page, "first blog", "Amy Ducan", 'https://fake.link1.com')
        await createBlog(page, "second blog", "Teddy Ducan", 'https://fake.link2.com')
        await createBlog(page, "third blog", "Teddy Ducan", 'https://fake.link3.com')
      })

      test('the blog can be liked', async ({ page }) => {
        await findAndLike(page, 'second blog', 1)
        const toLike = page.locator('li').filter({ hasText: 'second blog' })
        await expect(toLike.getByText('likes 1')).toBeVisible() 
      })

      test('the blog can be deleted by the creator', async ({ page }) => {
        const toDelete = page.locator('li').filter({ hasText: 'third blog' })
        await toDelete.getByRole('button', {name: "view"}).click()

        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })

        const removeBtn = toDelete.getByRole('button', { name: 'remove' })
        await removeBtn.waitFor({ state: 'visible' })
        await removeBtn.click()

        await expect(toDelete.getByText('third blog')).not.toBeVisible()
      })

      test("only the user who added the blog sees the blog's delete button", async({ page, request }) => {
        await page.getByRole('button', {name: 'logout'}).click()

        await request.post('/api/users', {
          data: {
            username: "devil",
            name: "Gabel",
            password: "adventure"
          }
        })
        await page.goto('/')
        await loginWith(page, 'devil', 'adventure')

        const toDelete = page.locator('li').filter({ hasText: 'third blog' })
        await toDelete.getByRole('button', {name: "view"}).click()
        await expect(toDelete.getByRole('button', {name: 'remove'})).not.toBeVisible()
      })

      test('blogs are arranged in the order according to the likes', async ({ page }) => {
        await findAndLike(page, 'first blog', 1)
        await findAndLike(page, 'second blog', 2)
        await findAndLike(page, 'third blog', 3)

        const blogs = page.locator('li')
        await expect(blogs.nth(0).getByText(/third blog/)).toBeVisible()
        await expect(blogs.nth(1).getByText(/second blog/)).toBeVisible()
        await expect(blogs.nth(2).getByText(/first blog/)).toBeVisible()
      })
    })
  })


})