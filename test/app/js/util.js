function executeScript(script) {
	browser.driver.executeScript(script);
}

function getResult(script) {
	return browser.driver.executeScript("return " + script);
}

function getAll(locatior) {
	return browser.findElements(locatior);
}

function isInitialized(elementId, widget) {
	expect(element(by.id(elementId)).isDisplayed()).toBe(true);
	var isDataExist = getResult('$("#' + elementId + '").data("' + widget + '") != undefined');
	expect(isDataExist).toBe(true);
}

function resetNorthwindScope() {
	browser.driver.executeScript(
		'angular.element($("#grid1")).scope().northwind = angular.copy(angular.element($("#grid1")).scope().northwind_bak.slice(0));'
	);
	browser.driver.executeScript(
		'angular.element($("#grid1")).scope().$apply();'
	);
}

module.exports.executeScript = executeScript;
module.exports.getResult = getResult;
module.exports.isInitialized = isInitialized;
module.exports.getAll = getAll;
module.exports.resetNorthwindScope = resetNorthwindScope;