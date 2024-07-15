import {expect, test} from "@playwright/test";


test("Check that the car image links are not broken", async ({page}) => {
    //increase test timeout because of a longer test execution
    test.slow();

    //navigate to all models
    await page.goto("https://www.bmw.de/de/neufahrzeuge.html", {waitUntil: "networkidle"});

    //get all the car images
    const images = page.locator("img[class*='cmp-cosy-img cmp-modelcard__cosy-img']");

    //count them
    console.log(await images.count());

    /////////////
    //scrolls remaining before the script exits
    let scrollsRemaining = 30;
    //while we have scrolls remaining
    while (scrollsRemaining > 0) {
        //scroll down by 10,000 pixels
        await page.evaluate(()=> window.scrollBy(0, 10000));
        //use a hardcoded wait time of one second for content to load
        await page.waitForLoadState("networkidle", {
            timeout: 10000
        });
        //decrement the scrolls remaining
        scrollsRemaining--;
    }
    /////////////


    //scroll to the bottom of the page to load all of them
    // await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));

    // await page.waitForTimeout(1000);

    //get the src value of each image element
    const allImages = await images.all();
    for await (const img of allImages) {
        const imgSrc = await img.getAttribute("src");
        //check that it's not empty
        expect(imgSrc?.length).toBeGreaterThan(1);

        if (imgSrc?.length > 1) {
            //check that the status code of the image is 200 (no broken image)
            const response = await page.request.get(imgSrc);
            console.log(response.status());

            if (!(response.status() === 200)) {
                console.log("Failed to load: " + imgSrc);
            }
        }
    }
});