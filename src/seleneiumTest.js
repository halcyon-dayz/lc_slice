const {By, Key, until, Builder, Time} = require("selenium-webdriver");
require("chromedriver");

async function TestFunc() {

    const modulesFolder = "s";
    let driver = await new Builder().forBrowser('chrome').build();
    
    await driver.get("https://www.yarnpkg.com/");
    await driver.findElement(By.css('div.css-vi1gim.eu8i7nl0 input.css-9u8p6d.e1by9f33')).sendKeys("apollo-client", Key.RETURN);
    let elements = await driver.findElements(By.css("span.css-1gw57o2 e8k2lk61"),);
    elements[1].click();
    let count = elements.length;
    console.log(count);
    await driver.quit();
}
TestFunc();