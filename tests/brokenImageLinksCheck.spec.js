import {expect, test} from "../base";
import {scrollToTheBottomOfThePage} from "../utils/utils";
import webPageLink from "../data/webPageLinks.json";


test("Check that the car image links are not broken on the All Models page", async ({modelPage, page}) => {
    //increase test timeout because of a longer test execution
    test.slow();

    //navigate to all models
    await modelPage.gotoModelPage();
    await page.getByRole('button', {name: 'Alle akzeptieren'}).click();

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
    test(`${data.webPage} - Check the webpages for broken images`, async ({
                                                                                               page,
                                                                                               request
                                                                                           }) => {
        test.slow();
        let count = 0;

        //navigate to all models
        await page.goto(`${data.link}`, {waitUntil: "load"});
        await page.getByRole('button', {name: 'Alle akzeptieren'}).click();
        await page.waitForLoadState("load")

        //get all the car images
        const images = page.locator("//img[contains(@src, 'preview3')]");
        const numberOfImages = await images.count();

        //get the src value of each image element
        let url;
        for (let i = 0; i < numberOfImages; i++) {
            const imgSrc = await images.nth(i).getAttribute("src");

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
                    console.log(`Failed link: ${url} Status code: ${response.status()}\n`);

                    let brokenImage = await images.nth(i);
                    await brokenImage.evaluate(element => element.scrollIntoView({ block: "center" }));
                    await brokenImage.evaluate(element => {
                        element.style.border = '5px solid red'; // Change the border style and color as needed
                    });

                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: `tests/__screenshots__/brokenImagesTest/${data.webPage}-screenshots${i}.png`});
                } else {
                    count++;
                }
                //reset response value
                await response.dispose();
            }
        }
        //at every end of the run log the number of broken links and where they occur for easier debugging
        console.log(`\n${numberOfImages - count} links broken out of ${numberOfImages} on the ${data.webPage} link: \n${data.link}`);
    });
});



test("Playwright trace demo", async({page})=>{
    await page.goto('https://www.bmw.de/de/elektroauto/plug-in-hybrid.html#faq');
    await page.getByRole('button', {name: 'Alle akzeptieren'}).click();

    await expect(await page.locator("[alt=\"BMW Plug-in-Hybrid BMW Online Geniuss\"]")).toBeVisible();
});
