# Pre-requisites
1. Install Node.js
2. Install Git
3. Clone project

# Install Project
1. Open terminal in root folder of the project
2. Install project by writing in the terminal ```npm install```

# Run Project
- ```npx playwright test``` - Runs all tests available in the tests folder
- To run only 1 test add the ```.only``` property to the test you want to run  
```
test.only("Test 1", async()=>{
    steps...
})
```