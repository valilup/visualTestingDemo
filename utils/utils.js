
export async function scrollToTheBottomOfThePage(page) {
    //scrolls remaining before the script exits
    let scrollsRemaining = 30;
    //while we have scrolls remaining
    while (scrollsRemaining > 0) {
        //scroll down by 10,000 pixels
        await page.evaluate(() => window.scrollBy(0, 10000));
        //use a hardcoded wait time of one second for content to load
        await page.waitForLoadState("load", {
            timeout: 10000
        });
        //decrement the scrolls remaining
        scrollsRemaining--;
    }
}