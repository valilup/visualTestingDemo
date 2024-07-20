import {expect, test} from "../base";
import {scrollToTheBottomOfThePage} from "../utils/utils";


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

[
    {webPage: "Homepage", link: "https://www.bmw.de/de/index.html"},
    {webPage: "BMW Electric cars page", link: "https://www.bmw.de/de/elektroauto.html"},
    {webPage: "BMW Plugin Hybrid cars page", link: "https://www.bmw.de/de/elektroauto/plug-in-hybrid.html"},
    {webPage: "The range of electric cars page", link: "https://www.bmw.de/de/elektroauto/elektroauto-reichweite.html"},
    {webPage: "The cost of an electric car page", link: "https://www.bmw.de/de/elektroauto/elektroauto-kosten.html"},
    {webPage: "The New Class page", link: "https://www.bmw.de/de/mehr-bmw/neue-klasse.html"},
    {webPage: "Everything about charging your BMW electric car page", link: "https://www.bmw.de/de/elektroauto/elektroauto-laden.html"},
    {webPage: "Home Charging page", link: "https://www.bmw.de/de/elektroauto/elektroauto-laden/zuhause-laden.html"},
    {webPage: "Connected Home Charging page", link: "https://www.bmw.de/de/elektroauto/elektroauto-laden/zuhause-laden/connected-home-charging.html"},
    {webPage: "Public charging for electric cars page", link: "https://www.bmw.de/de/elektroauto/elektroauto-laden/oeffentlich-laden.html"},
    {webPage: "BMW video tutorials on electromobility page", link: "https://www.bmw.de/de/elektroauto/video-tutorials.html"},
    {webPage: "Overview Online Stores page", link: "https://www.bmw.de/de/landingpage/shops.html"},
    {webPage: "Configurator page", link: "https://www.bmw.de/de/konfigurator.html"},
    {webPage: "New car search page", link: "https://www.bmw.de/de-de/sl/neuwagensuche#/"},
    {webPage: "Onlinekauf & -leasing page", link: "https://www.bmw.de/de/topics/neuwagen/neuwagen-onlinekauf.html"},
    {webPage: "Used car search page", link: "https://gebrauchtwagen.bmw.de/nsc/"}, //to be extracted from here special case
    {webPage: "BMW ConnectedDrive Store page", link: "https://www.bmw.de/de/shop/ls/cp/connected-drive"},
    {webPage: "BMW Accessories Store page", link: "https://www.bmw.de/de/shop/ls/cp/physical-goods/de-BF_ACCESSORY"},
    {webPage: "BMW Lifestyle Store page", link: "https://www.bmw.de/de/shop/ls/cp/physical-goods/de-BF_LIFESTYLE"},
    {webPage: "BMW trade-in page", link: "https://www.bmw.de/de/inzahlungnahme/"},
    {webPage: "Buy online page", link: "https://www.bmw.de/de/shop/ls/cp/physical-goods/de-BF_ACCESSORY"},
].forEach(({webPage, link}) => {
    test.only(`Check if ${webPage} contains broken images the src of img elements`, async ({
                                                                                                                            page,
                                                                                                                            request
                                                                                                                        }) => {
        let count = 0;

        //navigate to all models
        await page.goto(`${link}`, {waitUntil: "load"});
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
            expect.soft(imgSrc?.length).toBeGreaterThan(1);
            if (imgSrc?.length > 1) {

                if (imgSrc.includes("https://")) {
                    url = imgSrc;
                } else {
                    url = "https://www.bmw.de" + imgSrc;
                }


                const response = await request.get(url, {
                    headers: {
                        accept: 'application/json',
                        "accept-encoding": 'application/json',
                    }
                });
                await expect.soft(response.status()).toEqual(200);
                if (!(response.status() === 200)) {
                    console.log(`Failed link: ${url} Status code: ${response.status()}`);
                } else {
                    count++;
                }
                await response.dispose();
            }
        }
        console.log(`${numberOfImages - count} links broken out of ${numberOfImages} on the ${webPage} link: ${link}`)
    })
});
