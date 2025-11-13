const loginWith = async (page, username, password) => {
    await page.getByRole('textbox', {name: 'username'}).fill(username)
    await page.getByRole('textbox', {name: 'password'}).fill(password)
    await page.getByRole('button', {name: 'login'}).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', {name: "create new blog"}).click()
    await page.getByRole('textbox', {name: 'title:'}).fill(title)
    await page.getByRole('textbox', {name: 'author:'}).fill(author)
    await page.getByRole('textbox', {name: 'url:'}).fill(url)
    await page.getByRole('button', {name: "create"}).click()
    const newBlog = page.locator('li', { hasText: title })
    await newBlog.waitFor({ state: 'visible' })
}

const findAndLike = async (page, title, times) => {
    const toLike = page.locator('li').filter({ hasText: title })
    await toLike.getByRole('button', {name: "view"}).click()
    for (let i = 0; i < times; i++) {
        await toLike.getByRole('button', {name: 'like'}).click()
    }   
}

export { loginWith, createBlog, findAndLike }