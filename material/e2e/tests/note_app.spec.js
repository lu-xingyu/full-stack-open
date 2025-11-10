const { test, describe, expect } = require('@playwright/test')


// page is an object provided by Playwright, representing a tab/page on broswer //('http://localhost:5173')
describe('Note app', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('https://didactic-halibut-q7pxpr6qv64g346j7-5173.app.github.dev/')

    /*
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    */
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })
})
