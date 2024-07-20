const base = require('@playwright/test');
const {HomePage} = require("./pages/homepage");
const {ModelPage} = require("./pages/modelpage");

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
exports.test = base.test.extend({
    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },

    modelPage: async ({page}, use) => {
        await use(new ModelPage(page));
    },
});
exports.expect = base.expect;