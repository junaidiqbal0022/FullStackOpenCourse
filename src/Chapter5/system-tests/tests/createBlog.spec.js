// @ts-check
import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';
import axios from 'axios'
import helper from './helper';

test.describe('Blog Tests', () => {
    test.beforeEach(async ({ page }) => {
        await helper.resetAndCreateuser()
        await helper.openAndLogin(page)
    })

    test('Create Form is hidden', async ({ page }) => {
        await expect(page.getByRole("button", { name: "Create new Blog" })).toBeVisible()
    });
    test('Create Blog', async ({ page }) => {
        const blog = helper.blog
        await helper.noBlog(page);
        await helper.createBlog(page)
        await helper.verifyUnOpenedBlog(page, blog.title, blog.author, blog.url);
        await helper.verifyExpendedBlog(page, blog.title, blog.author, blog.url);
    });

    test('Like Thee blog, you self liker', async ({ page }) => {
        const blog = helper.blog
        await helper.noBlog(page);
        await helper.createBlog(page)
        await helper.verifyUnOpenedBlog(page, blog.title, blog.author, blog.url);
        await helper.verifyExpendedBlog(page, blog.title, blog.author, blog.url);
        await helper.likeBlog(page)
    });

    test('Delete Thee blog', async ({ page }) => {
        const blog = helper.blog
        await helper.noBlog(page);
        await helper.createBlog(page)
        await helper.verifyUnOpenedBlog(page, blog.title, blog.author, blog.url);
        await helper.verifyExpendedBlog(page, blog.title, blog.author, blog.url);
        await helper.deleteBlog(page)
    });

    //I did bit differently, only creators can see blogs
    test(`Make a test that ensures that only the user who added the blog sees the blog's delete button.`, async ({ page }) => {
        const blog = helper.blog
        await helper.noBlog(page);
        await helper.createBlog(page)
        await helper.verifyUnOpenedBlog(page, blog.title, blog.author, blog.url);
        await helper.logout(page)
        await helper.createUser(page, "meeee", "myyyy")
        await helper.loginUser(page, "meeee", "myyyy")
        await helper.noBlog(page);

    });

    test('Like order', async ({ page }) => {
        const blog = helper.blog
        await helper.noBlog(page);
        await helper.createBlog(page)
        await helper.verifyUnOpenedBlog(page, blog.title, blog.author, blog.url);
        await helper.verifyExpendedBlog(page, blog.title, blog.author, blog.url);
        await helper.likeBlog(page)
        await page.pause()
        await helper.cancelForm(page)

        await helper.createBlog(page, {
            author: 'my name',
            title: "your name",
            likes: 100000,
            url: "somthing:3000"
        })
        await helper.verifyUnOpenedBlog(page, "your name", 'my name', "somthing:3000")
        await helper.blogsOrder(page)



    });



});