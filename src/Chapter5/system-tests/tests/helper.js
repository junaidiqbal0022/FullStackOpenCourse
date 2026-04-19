
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
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await page.getByLabel('Username').first().fill(user);
    await page.getByLabel('Password').last().fill(passs);
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByRole("heading", {
        name: `${user} is logged in`
    }).first()).toBeVisible();
}
const openAndLogin = async (page) => {
    await page.goto('/');
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

    await page.getByLabel('Username').first().fill('root');
    await page.getByLabel('Password').last().fill('root');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByRole("heading", { name: "root is logged in" }).first()).toBeVisible();
}
const createBlog = async (page, blogs = null) => {
    blogs = blogs ?? blog
    await page.getByRole('button', { name: 'Create new Blog' }).click();
    await page.getByRole('textbox', { name: 'Title:' }).click();
    await page.getByRole('textbox', { name: 'Title:' }).fill(blogs.title);
    await page.getByRole('textbox', { name: 'Author:' }).fill(blogs.author);
    await page.getByRole('textbox', { name: 'Url:' }).fill(blogs.url);
    await page.getByRole('button', { name: 'submit the form' }).click();
}
const verifyUnOpenedBlog = async (page, title, author, url) => {
    await expect(page.getByRole('button', { name: 'View' })).toBeVisible();
    const text = `${title} by ${author}`;
    await expect(page.getByText(text)).toBeVisible();
    await expect(page.getByText(url)).not.toBeVisible()
}
const verifyExpendedBlog = async (page, title, author, url) => {
    const btn = page.getByRole('button', { name: 'View' });
    await expect(btn).toBeVisible();
    await btn.click()
    title = `Title: ${title}`
    author = `Author: ${author}`
    url = `Link:${url}`
    await expect(page.getByText(title)).toBeVisible();
    await expect(page.getByText(author)).toBeVisible();
    await expect(page.getByText(url)).toBeVisible()
    await expect(page.getByText("Likes:")).toBeVisible()
}
const noBlog = async (page) => {
    await expect(page.getByText('No blogs to Display')).toBeVisible();
}
const likeBlog = async (page) => {
    const likeText = "Successfully liked the blog.."
    const btn = page.getByRole('button', { name: 'Like' });
    await expect(btn).toBeVisible();
    await btn.click()
    const errorDiv = page.locator('.error').filter({ hasText: likeText })
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toHaveText(likeText)
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
    const errorDiv = page.locator('.error').filter({ hasText: text })
    await expect(errorDiv).toBeVisible();
    await expect(errorDiv).toContainText(text)
}
const logout = async (page) => {
    const btn = page.getByRole('button', { name: 'logout' });
    await expect(btn).toBeVisible();
    await btn.click()
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
}
const cancelForm = async (page) => {
    const btn = page.getByRole('button', { name: 'cancel' });
    await expect(btn).toBeVisible();
    await btn.click()
}

const blogsOrder = async (page) => {
    const likes = await page.getByText('Likes:');
    const texts = await likes.allTextContents();

    const numbers = texts.map(t => Number(t.split('Likes: ')[1].split(' ')[0]));
    expect(numbers[0]).toBeGreaterThan(numbers[1])
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
    blogsOrder
}