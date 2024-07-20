// import {expect, test} from "@playwright/test";
//
//
// const URL = "https://www.bmw.de";
// test.describe('Visual check navigation to homepage', () => {
//     test.beforeEach(async ({page}) => {
//         // Go to bwm homepage
//         await page.goto(URL);
//
//         //accept cookies
//         await page.getByRole('button', {name: 'Alle akzeptieren'}).click();
//     });
//
//
//     test("Basic test - checks the homepage first view", async ({page}) => {
//         await expect(page).toHaveScreenshot("first view.png");
//     });
//
//     test("Visual test - checks the homepage full page", async ({page}) => {
//         await expect(page).toHaveScreenshot("homepage full page.png", {fullPage: true});
//     });
//
//     test("Visual test - check Made to Express section", async ({page}) => {
//         await expect(page.locator("[class*='container responsivegrid style-common--cmp-spacing-top-16']")).toHaveScreenshot("made to express section.png");
//     });
// });
