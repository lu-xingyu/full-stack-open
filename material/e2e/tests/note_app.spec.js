const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

// page is an object provided by Playwright, representing a tab/page on broswer //('http://localhost:5173')
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()

    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })
  
  test('use can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'a note created by playwright')
      })
  
      test('importance can be changed', async ({ page }) => {
        const note = page.locator('.note', {hasText: 'a note created by playwright'})
        await note.getByRole('button', { name: 'make not important' }).click()
        await expect(note.getByText('make important')).toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        const div = page.locator('li').filter({ hasText: 'third note' })
        await div.getByRole('button').click()
        
        await expect(div.getByText('make important')).toBeVisible()
      })
    })
  })
})
