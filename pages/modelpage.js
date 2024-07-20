exports.ModelPage = class ModelPage {

    constructor(page) {
        this.page = page;
        this.carImages = page.locator("img[class*='cmp-cosy-img cmp-modelcard__cosy-img']");
    }

    async goto() {
        await this.page.goto('https://www.bmw.de/de/neufahrzeuge.html', { waitUntil: 'load' });
    }
};