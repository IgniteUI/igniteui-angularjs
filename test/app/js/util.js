var ptor = protractor.getInstance();

function executeScript(script) {
	ptor.driver.executeScript(script);
}

function getResult(script) {
	return ptor.driver.executeScript('return ' + script);
}

function getAll(locatior) {
	return ptor.findElements(locatior);
}

function isInitialized(elementId, widget) {
	expect(element(by.id(elementId)).isDisplayed()).toBe(true);
	var isDataExist = getResult('$("#' + elementId + '").data("' + widget + '") != undefined');
	expect(isDataExist).toBe(true);
}

function resetNorthwindScope() {
	ptor.driver.executeScript(
		'angular.element($("#grid1")).scope().northwind = angular.copy(angular.element($("#grid1")).scope().northwind_bak.slice(0));'
	);
	ptor.driver.executeScript(
		'angular.element($("#grid1")).scope().$apply();'
	);
}

module.exports.executeScript = executeScript;
module.exports.getResult = getResult;
module.exports.isInitialized = isInitialized;
module.exports.getAll = getAll;
module.exports.resetNorthwindScope = resetNorthwindScope;