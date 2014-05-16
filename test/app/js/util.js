var ptor = protractor.getInstance();

function executeScript(script) {
	ptor.driver.executeScript(script);
}

function getResult(script) {
	return ptor.driver.executeScript('return ' + script);
}

function isInitialized(elementId, widget) {
	expect(element(by.id(elementId)).isDisplayed()).toBe(true);
	var isDataExist = getResult('$("#' + elementId + '").data("' + widget + '") != undefined');
	expect(isDataExist).toBe(true);
}

module.exports.executeScript = executeScript;
module.exports.getResult = getResult;
module.exports.isInitialized = isInitialized;