function testEventListener(widget, elementId, event) {
	return $("#" + elementId).data(widget).options[event] !== undefined;
}

function typeInInput(characters, element, callback) {
    var keyDown = jQuery.Event("keydown"),
       keyPress = jQuery.Event("keypress"),
       keyUp = jQuery.Event("keyup"),
       value = "";

    characters.split("").forEach(function (ch) {
        keyDown.keyCode = keyUp.keyCode = keyPress.keyCode = ch.charCodeAt(0);
        keyDown.charCode = keyUp.charCode = keyPress.charCode = ch.charCodeAt(0);
        element.trigger(keyDown);
        element.trigger(keyPress);
        value = value + ch;
        element.val(value);
        element.trigger(keyUp);
        element.trigger("input"); // also throw input for Angular, ngModel only listens for that when supported
        if (callback) {
            callback();
        }
    });
}

function typeInInputWrap(characters, element, scopeEval) {
    var editUpdateFlag = false,
        scope = element.scope(),
        originalValue = scope.$eval(scopeEval);
    typeInInput(characters, element, function () {
        //check scope value remains unchanged during search entry
        if (scope.$eval(scopeEval) != originalValue) {
            editUpdateFlag = true;
        }
    });
    return editUpdateFlag;
}

function keyInteraction(key, target, special) {
    keyDownChar(key, target, special);
    keyPressChar(key, target, special);
    keyUpChar(key, target, special);
}
function keyDownChar(key, target, special) {
    var evt = $.Event("keydown");
    evt.keyCode = key;
    evt.charCode = key;
    if (special) {
        evt[special] = true;
    }
    target.trigger(evt);
}
function keyPressChar(key, target, special) {
    var evt = $.Event("keypress");
    evt.keyCode = key;
    evt.charCode = key;
    if (special) {
        evt[special] = true;
    }
    target.trigger(evt);
}
function keyUpChar(key, target, special) {
    var evt = $.Event("keyup");
    evt.keyCode = key;
    evt.charCode = key;
    if (special) {
        evt[special] = true;
    }
    target.trigger(evt);
}