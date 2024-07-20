exports.HomePage = class HomePage {

    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://www.bmw.de', { waitUntil: 'load' });
    }
};