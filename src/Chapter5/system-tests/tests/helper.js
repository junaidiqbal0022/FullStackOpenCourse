
import axios from 'axios'
import { test, expect } from '@playwright/test';
const baseUsers = "http://localhost:3001/api/users";
const basereset = "http://localhost:3001/api/reset";
const baseUi = "http://localhost:5173";

const blog = {
    author: "Thomas Shelby",
    title: "Peaky Blinders",
    url: "http://netflix.com"
}
const user = {
    username: "root",
    name: "root",
    password: "root"
}
const placeHolders = {
    title: "write title here",
    url: "write url here",
    author: "write author here",
}

const resetAndCreateuser = async () => {
    await axios.post(basereset)
    await axios.post(baseUsers, user)
}
const createUser = async (page, user, passs) => {
    const user1 = {
        username: user,
        name: user,
        password: passs
    }
    await axios.post(baseUsers, user1)
}

const loginUser = async (page, user, passs) => {
    await page.goto('/');
    const item = page.getByRole("link", { name: "Login" });
    await expect(item).toBeVisible();
    await item.click();
    await page.getByLabel('Username').first().fill(user);
    await page.getByLabel('Password').last().fill(passs);
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByRole("link", { name: "logout" }).first()).toBeVisible();

}
const openAndLogin = async (page) => {
    await page.goto('/');
    const item = page.getByRole("link", { name: "Login" });
    await expect(item).toBeVisible();
    await item.click()
    await page.getByLabel('Username').first().fill('root');
    await page.getByLabel('Password').last().fill('root');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByRole("link", { name: "logout" }).first()).toBeVisible();
}
const createBlog = async (page, blogs = null) => {
    blogs = blogs ?? blog
    await page.getByRole('link', { name: 'Create Blog' }).click();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill(blogs.title);
    await page.getByRole('textbox', { name: 'Author' }).fill(blogs.author);
    await page.getByRole('textbox', { name: 'Url' }).fill(blogs.url);
    await page.getByRole('button', { name: 'Create' }).click();
}
const verifyUnOpenedBlog = async (page, title, author, url) => {
    const text = `${title}`;
    await expect(page.getByRole('link', { name: text })).toBeVisible();
}
const verifyExpendedBlog = async (page, title, author, url) => {
    const text = `${title}`;
    await page.getByRole('link', { name: text }).click()
    title = `${title}`
    author = `${author}`
    url = `${url}`
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.getByText(author)).toBeVisible();
    await expect(page.getByText(url)).toBeVisible()
    await expect(page.getByText("Likes")).toBeVisible()
}
const noBlog = async (page) => {
    await expect(page.getByText('No blogs to Display')).toBeVisible();
}
const likeBlog = async (page) => {
    const likeText = "Successfully liked the blog.."
    const btn = page.getByRole('button', { name: 'Like' });
    await expect(btn).toBeVisible();
    await btn.click()
    const errorDiv = page.getByRole('alert').filter({ hasText: likeText })
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toHaveText(likeText)
}
const selfLikeBlog = async (page) => {
    const btn = page.getByRole('button', { name: 'Like' });
    await expect(btn).not.toBeVisible();
}
const deleteBlog = async (page) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        await dialog.accept();
    });
    const text = `"Someone" deleted the title: `
    const btn = page.getByRole('button', { name: 'Remove' });
    await expect(btn).toBeVisible();
    await btn.click()
    const errorDiv = page.getByRole('alert').filter({ hasText: text })
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toContainText(text)
}
const logout = async (page) => {
    const btn = page.getByRole('link', { name: 'logout' });
    await expect(btn).toBeVisible();
    await btn.click()
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
}
const cancelForm = async (page) => {
    const btn = page.getByRole('button', { name: 'cancel' });
    await expect(btn).toBeVisible();
    await btn.click()
}

const blogsOrder = async (page, first, last) => {
    const texts = await page.locator("tr").allTextContents();
    console.log(texts)
    const firstIndex = texts.findIndex(text => text.includes(first.title) && text.includes(first.author))
    console.log("first index: ", firstIndex)
    const lastIndex = texts.findIndex(text => text.includes(last.title) && text.includes(last.author))
    console.log("last index: ", lastIndex)
    expect(firstIndex).toBeLessThan(lastIndex)
}
module.exports = {
    placeHolders,
    blog,
    user,
    baseUi,
    basereset,
    baseUi,
    resetAndCreateuser,
    openAndLogin,
    createBlog,
    verifyUnOpenedBlog,
    verifyExpendedBlog,
    noBlog,
    likeBlog,
    createUser,
    loginUser,
    deleteBlog,
    logout,
    cancelForm,
    blogsOrder,
    selfLikeBlog
}