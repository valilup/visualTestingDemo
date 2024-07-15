import {expect, test} from "@playwright/test";


test("Check that the car image links are not broken", async ({page}) => {
    //increase test timeout because of a longer test execution
    test.setTimeout(60000);

    //navigate to all models
    await page.goto("https://www.bmw.de/de/neufahrzeuge.html", {waitUntil: "domcontentloaded"});

    //get all the car images
    const images = page.locator("img[class*='cmp-cosy-img cmp-modelcard__cosy-img']");

    //count them
    console.log(await images.count());

    //scroll to the bottom of the page to load all of them
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));

    //get the src value of each image element
    const allImages = await images.all();
    for await (const img of allImages) {
        const imgSrc = await img.getAttribute("src");
        //check that it's not empty
        expect.soft(imgSrc?.length, "Failed to load: " + imgSrc).toBeGreaterThan(1);

        if (imgSrc?.length > 1) {
            //check that the status code of the image is 200 (no broken image)
            const response = await page.request.get(imgSrc);
            await expect.soft(response.status(), "Failed to load: " + imgSrc).toBe(200);
        }
    }
});