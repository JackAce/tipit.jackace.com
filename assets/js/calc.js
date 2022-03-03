
function getDisplayText() {
    let returnValue = $('#calc-display-div').text();
    return returnValue;
}

function getDisplayValue() {
    let displayText = getDisplayText();
    let displayValue = parseFloat(displayText);
    return displayValue;
}

// --------------------------------------------------
// Takes in billAmount and spits out an array of possible
// tip values and billTotals.

function getPalindromicValues() {
    let billAmount = getDisplayValue();
    let returnValue = [];

    let billAmountInCents = parseInt(billAmount * 100);
    // Max cap at 40% tip
    let stopAmount = parseInt(billAmountInCents * 0.41);

    // Loop through every possible tip amount, incrementing by a penny
    for (let i = 1; i <= stopAmount; i++) {
        let totalAmount = billAmountInCents + i;

        if (isPalindromic(totalAmount)) {
            //console.log('palindromic tip found: ' + (i / 100) + ' total: ' + totalAmount);
            returnValue.push({
                tipAmount: i / 100,
                tipPercent: (100 * i) / billAmountInCents,
                totalAmount: totalAmount / 100
            });
        }

    }

    return returnValue;
}

// --------------------------------------------------
// Is the integer a palindrome?

function isPalindromic(integerValue) {
    let valueText = '' + integerValue;
    let fullLength = valueText.length;
    let halfLength = parseInt(valueText.length/2);
    for (let i = 0; i < halfLength; i++) {
        if (valueText.charAt(i) !== valueText.charAt(fullLength - i - 1)) {
            return false;
        }
    }

    return true;
}

function setDisplayText(text) {
    return $('#calc-display-div').text(text);
}

function bufferIsInteger() {
    let currentText = getDisplayText();
    var integersOnlyRegEx = new RegExp('^[0-9]*$');
    return integersOnlyRegEx.test(currentText);
}

function bufferIsAtMaxIntegerLength() {
    let currentText = getDisplayText();
    var integersOnlyRegEx = new RegExp('^[0-9]{4}$');
    return integersOnlyRegEx.test(currentText);
}

function bufferIsComplete() {
    let currentText = getDisplayText();
    var completedRegEx = new RegExp('^[0-9]+[\.]{1}[0-9]{2}$');
    return completedRegEx.test(currentText);
}

function processNumber(number) {
    console.log('You pressed: ' + number);

    document.getSelection().removeAllRanges();
    if (bufferIsComplete()) {
        // Don't do anything
        return;
    }

    if (bufferIsAtMaxIntegerLength()) {
        // Don't do anything
        return;
    }


    let currentText = getDisplayText();

    if (currentText === '' && number === 0) {
        // Don't do anything
        return;
    }

    currentText = currentText + number.toString();
    setDisplayText(currentText);
    performCalculations();
}

function processDot() {
    console.log('You pressed: .');

    document.getSelection().removeAllRanges();
    if (!bufferIsInteger()) {
        // Don't do anything
        return;
    }

    let currentText = getDisplayText();
    currentText = currentText + '.';
    setDisplayText(currentText);
}

function processBackspace() {
    console.log('You pressed: BACKSPACE');

    document.getSelection().removeAllRanges();
    let currentText = getDisplayText();
    let currentTextLength = currentText.length;

    if (currentTextLength === 0) {
        // Don't do anything
        return;
    }

    currentText = currentText.substr(0, currentTextLength - 1);
    setDisplayText(currentText);
    performCalculations();
}

function performCalculations() {
    clearResults(); 
    let results = getPalindromicValues();
    addResults(results);
}

function clearDisplayText() {
    $('#calc-display-div').text('');
}

function clearResults() {
    $('#calc-results-footer > tr').remove();
}

function formatDecimal(value) {
    value = parseFloat(value);
    value = value.toFixed(2);
    var returnValue = value.toString();

    // if (returnValue.indexOf('.00') > -1) {
    //     // Truncate anything with zero cents
    //     returnValue = returnValue.replace('.00', '');
    // }

    return returnValue;
}

function addResults(resultArray) {
    for (let i = 0; i < resultArray.length; i++) {
        let html = '<tr class="calc-result">';

        html += '<td>';
        html += formatDecimal(resultArray[i].tipPercent) + '%';
        html += '</td>';
        html += '<td>';
        html += '$' + formatDecimal(resultArray[i].tipAmount);
        html += '</td>';
        html += '<td>';
        html += '$' + formatDecimal(resultArray[i].totalAmount);
        html += '</td>';
        html += '</tr>';

        $('#calc-results-footer').append(html);

    }
}

$(document).ready(function() {
    clearDisplayText();
    clearResults(); 
    console.log('calc.js loaded via document ready!!!');
});