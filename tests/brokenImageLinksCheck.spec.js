import {expect, test} from "../base";
import {scrollToTheBottomOfThePage} from "../utils/utils";
import webPageLink from "../data/webPageLinks.json";


test("Check that the car image links are not broken on the All Models page", async ({modelPage, page}) => {
    //increase test timeout because of a longer test execution
    test.slow();

    //navigate to all models
    await modelPage.goto();

    //get all the car images
    const images = modelPage.carImages;

    //scroll to the bottom of the page for the cars to be rendered
    await scrollToTheBottomOfThePage(page);

    //get the src value of each image element
    const allImages = await images.all();
    for await (const img of allImages) {
        const imgSrc = await img.getAttribute("src");
        //check that it's not empty
        expect.soft(imgSrc?.length).toBeGreaterThan(1);

        if (imgSrc?.length > 1) {
            //check that the status code of the image is 200 (no broken image)
            const response = await page.request.get(imgSrc);

            if (!(response.status() === 200)) {
                console.log(`Failed to load following src resource:  + ${imgSrc} with status status ${response.status()}`);
                expect.soft(response.status() === 200);
            }
        }
    }
});

webPageLink.forEach((data) => {
    test(`Check if ${data.webPage} contains broken images the src of img elements`, async ({
                                                                                          page,
                                                                                          request
                                                                                      }) => {
        let count = 0;

        //navigate to all models
        await page.goto(`${data.link}`, {waitUntil: "load"});
        await page.getByRole('button', {name: 'Alle akzeptieren'}).click();


        // scrolls remaining before the script exits
        let scrollsRemaining = 30;
        //while we have scrolls remaining
        while (scrollsRemaining > 0) {
            //scroll down by 10,000 pixels
            await page.evaluate(() => window.scrollBy(0, 10000));
            //use a hardcoded wait time of one second for content to load
            await page.waitForLoadState("networkidle", {
                timeout: 10000
            });
            //decrement the scrolls remaining
            scrollsRemaining--;
        }
        await page.waitForLoadState("domcontentloaded")

        //get all the car images
        const images = page.locator("img");
        const numberOfImages = await images.count();

        //get the src value of each image element
        let url;
        const allImages = await images.all();
        for await (const img of allImages) {
            const imgSrc = await img.getAttribute("src");

            //check to see if you have a valid value in the src attribute
            expect.soft(imgSrc?.length).toBeGreaterThan(1);

            if (imgSrc?.length > 1) {
                // some values do not have the baseURL so I have to append it after I get the value
                if (imgSrc.includes("https://")) {
                    url = imgSrc;
                } else {
                    url = "https://www.bmw.de" + imgSrc;
                }

                //make a request to check that the value is retrieved correctly
                const response = await request.get(url, {
                    headers: {
                        accept: 'application/json',
                        "accept-encoding": 'application/json',
                    }
                });

                //expect status code to be 200
                await expect.soft(response.status()).toEqual(200);

                //if status is not 200 log the url and status code
                if (!(response.status() === 200)) {
                    console.log(`Failed link: ${url} Status code: ${response.status()}`);
                } else {
                    count++;
                }
                //reset response value
                await response.dispose();
            }
        }
        //at every end of the run log the number of broken links and where they occur for easier debugging
        console.log(`${numberOfImages - count} links broken out of ${numberOfImages} on the ${webPage} link: ${data.link}`);
    })
});
