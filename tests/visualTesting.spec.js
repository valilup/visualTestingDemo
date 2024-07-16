import {expect, test} from "@playwright/test";

test("Basic test - checks the homepage first view", async({page}) => {
   await page.goto("https://www.bmw.de", {waitUntil: "networkidle"});

   //accept cookies
   await page.getByRole('button', {name: 'Alle akzeptieren'}).click();

   //check homepage first view
   await expect(page).toHaveScreenshot("first view.png");
});

test("Visual test - checks the homepage full page", async({page}) => {
   await page.goto("https://www.bmw.de", {waitUntil: "networkidle"});

   //accept cookies
   await page.getByRole('button', {name: 'Alle akzeptieren'}).click();

   //check homepage first view
   await expect(page).toHaveScreenshot("homepage full page.png",{fullPage: true});
});

test("Visual test - check Made to Express section", async({page}) => {
   await page.goto("https://www.bmw.de", {waitUntil: "networkidle"});

   //accept cookies
   await page.getByRole('button', {name: 'Alle akzeptieren'}).click();

   //check homepage first view
   await expect(page.locator("[class*='container responsivegrid style-common--cmp-spacing-top-16']")).toHaveScreenshot("made to express section.png");
});