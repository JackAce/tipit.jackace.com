
function getDisplayText() {
    let returnValue = $('#calc-display-x').text();
    return returnValue;
}

// --------------------------------------------------

function getDisplayValueInCents() {
    const displayText = getDisplayText();
    if (displayText === '') {
        return 0;
    }
    const displayTextWithoutDecimal = displayText.replace('.', '');
    let returnValue = 0;

    const integersOnlyRegEx = new RegExp('^[0-9]*$');
    if (integersOnlyRegEx.test(displayText)) {
        returnValue = parseInt(displayTextWithoutDecimal) * 100;
        return returnValue;
    }

    const oneDecimalRegEx = new RegExp('^[0-9]+[\.]{1}[0-9]{1}$');
    if (oneDecimalRegEx.test(displayText)) {
        returnValue = parseInt(displayTextWithoutDecimal) * 10;
        return returnValue;
    }

    const twoDecimalsRegEx = new RegExp('^[0-9]+[\.]{1}[0-9]{2}$');
    if (twoDecimalsRegEx.test(displayText)) {
        returnValue = parseInt(displayTextWithoutDecimal);
        return returnValue;
    }

    return 0;
}

// --------------------------------------------------

function totalIsAllNines(totalInCents) {
    let totalString = totalInCents.toString();
    for (let i = 0; i < totalString.length; i++) {
        if (totalString.charAt(i) !== "9") {
            return false;
        }
    }

    return true;
}

// --------------------------------------------------

function positionIsNine(totalInCents, position) {
    let totalString = totalInCents.toString();
    return totalString.charAt(position) === "9";
}

// --------------------------------------------------

function getIncrementForLastTotalInCents(lastTotalInCents) {
    let totalAsString = lastTotalInCents.toString();
    let totalLength = totalAsString.length;
    
    if (totalIsAllNines(lastTotalInCents)) {
        return 2;
    }
    if (totalLength < 5 && positionIsNine(lastTotalInCents, 1)) {
        return 11;
    }
    if (totalLength >= 5 && positionIsNine(lastTotalInCents, 1) && positionIsNine(lastTotalInCents, 2)) {
        return 11;
    }
    if (positionIsNine(lastTotalInCents, 2)) {
        return 110;
    }

    if (lastTotalInCents < 1000) {
        // 3 digit total
        return 10;
    }
    if (lastTotalInCents < 10000) {
        // 4 digit total
        return 110;
    }
    if (lastTotalInCents < 100000) {
        // 5 digit total
        return 100;
    }
    if (lastTotalInCents < 1000000) {
        // 6 digit total
        return 1100;
    }
    if (lastTotalInCents < 1000000) {
        // 7 digit total
        return 1000;
    }

    return returnValue;
}

// --------------------------------------------------
// Takes in billAmount and spits out an array of possible
// tip values and billTotals.
// TODO: take in min% and max% values

function getPalindromicValues() {
    let billAmountInCents = getDisplayValueInCents();

    if (billAmountInCents <= 0) {
        return [];
    }

    let returnValue = [];
    let lastTotalInCents = 0;
    let lastTipAmountInCents = 0;
    const minTipPercent = 0.05;
    const maxTipPercent = 0.305;

    let startTipAmount = parseInt(billAmountInCents * minTipPercent);
    let stopTipAmount = parseInt(billAmountInCents * maxTipPercent);

    lastTipAmountInCents = startTipAmount - 1;

    let palindromeFound = false;
    // TODO - Increment by known values

    // FIND THE FIRST PALINDROME
    while (!palindromeFound) {
        lastTipAmountInCents++;
        lastTotalInCents = billAmountInCents + lastTipAmountInCents;
        palindromeFound = isPalindromic(lastTotalInCents);

        if (palindromeFound) {
            //lastTipAmountInCents
            returnValue.push({
                tipAmount: lastTipAmountInCents / 100,
                tipPercent: (100 * lastTipAmountInCents) / billAmountInCents,
                totalAmount: lastTotalInCents / 100
            });
        }
    }

    while (lastTipAmountInCents <= stopTipAmount) {
        let increment = getIncrementForLastTotalInCents(lastTotalInCents);
        lastTipAmountInCents += increment;

        lastTotalInCents = billAmountInCents + lastTipAmountInCents;
        // We shouldn't need to test for palindromes here
        //palindromeFound = isPalindromic(lastTotalInCents);

        returnValue.push({
            tipAmount: lastTipAmountInCents / 100,
            tipPercent: (100 * lastTipAmountInCents) / billAmountInCents,
            totalAmount: lastTotalInCents / 100
        });

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
    return $('#calc-display-x').text(text);
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
    $('#clear-img').show();

    performCalculations();
}

function processDot() {
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

    if (bufferIsComplete()) {
        setCalculatorDisplay(false);
    }
}

function clearDisplayText() {
    $('#calc-display-x').text('');
    $('#clear-img').hide();
    $('#calculator-img').hide();
    setCalculatorDisplay(true);
    performCalculations();
}

function clearResults() {
    $('#calc-results-footer>tr').remove();
    //$('#calc-results-footer > tr').remove();
    //$('.results-table-scroll>tfoot').hide();
}

function formatDecimal(value, places) {
    value = parseFloat(value);
    value = value.toFixed(places);
    var returnValue = value.toString();

    // if (returnValue.indexOf('.00') > -1) {
    //     // Truncate anything with zero cents
    //     returnValue = returnValue.replace('.00', '');
    // }

    return returnValue;
}

function addResults(resultArray) {
    for (let i = 0; i < resultArray.length; i++) {
        let cssClass = "calc-result ";
        let tipPercent = resultArray[i].tipPercent;
        let html = '<tr class="' + cssClass + '">';

        html += '<td>';
        html += '<div class="tip-percent" percent="' + tipPercent + '">';
        html += formatDecimal(tipPercent, 1) + '%';
        html += '</div>';
        html += '</td>';
        html += '<td>';
        html += '$' + formatDecimal(resultArray[i].tipAmount, 2);
        html += '</td>';
        html += '<td>';
        html += '$' + formatDecimal(resultArray[i].totalAmount, 2);
        html += '</td>';
        html += '</tr>';

        $('#calc-results-footer').append(html);
    }

    $('.results-table-scroll>tfoot').show();
    refreshTipColors();
}

function getColorForPercent(tipPercent) {
    const bottomTip = 8.0;
    const medianTip = 15.0;
    const topTip = 28.0;
    let tipDelta = 0.0;
    let delta = 0.0;
    let red = 0;
    let green = 0;

    if (tipPercent <= bottomTip) {
        // Red - stiff the server
        green = 0;
        red = 255;
    }
    else if (tipPercent <= medianTip) {
        // Between bottom and median - bad service
        tipDelta = medianTip - bottomTip;
        delta = tipPercent - bottomTip;
        green = parseInt(delta/tipDelta * 255);
        red = 255;
    }
    else if (tipPercent <= topTip) {
        tipDelta = topTip - medianTip;
        delta = tipPercent - medianTip;
        red = parseInt(255 - (255*delta/tipDelta));
        green = 255;
    }
    else {
        red = 0;
        green = 255;
    }

    const returnValue = `rgb(${red}, ${green}, 0)`;
    return returnValue;
}

function refreshTipColors() {
    $('.tip-percent').each(function () {
        let percent = parseFloat($(this).attr('percent'));

        $(this).css('background-color', getColorForPercent(percent));
    });
}

function toggleCalcDisplay() {
    setCalculatorDisplay(!isCalculatorVisible());
}

function setCalculatorDisplay(showCalculator) {
    if (showCalculator) {
        $('#top-half-div').attr('class', 'show-calculator');
        $('#calculator-img').hide();
        $('#list-img').show();
    } else {
        $('#top-half-div').attr('class', null);
        $('#list-img').hide();
        $('#calculator-img').show();
    }
    initializeDimensions();
}

function isCalculatorVisible() {
    let topHalfDivClasses = $('#top-half-div').attr('class');
    if (topHalfDivClasses && topHalfDivClasses.indexOf('show-calculator') > -1) {
        return true;
    }

    return false;
}

function initializeDimensions() {
    let wWidth = $(window).width();
    let wHeight = $(window).height();


    let topHalfCssClass = $('#top-half-div').attr('class');
    let showCalculator = false;
    if (topHalfCssClass && topHalfCssClass.indexOf('show-calculator') > -1) {
        showCalculator = true;
    }

    let topSectionHeightPercent = 0.5;
    let bottomSectionHeightPercent = 1 - topSectionHeightPercent;
    let topSectionHeight = wHeight * topSectionHeightPercent;
    let bottomSectionHeight = wHeight * bottomSectionHeightPercent;

    if (!showCalculator) {
        topSectionHeightPercent = 0.1;
        bottomSectionHeightPercent = 1 - topSectionHeightPercent;
        topSectionHeight = wHeight * topSectionHeightPercent;
        bottomSectionHeight = wHeight * bottomSectionHeightPercent;
    }

    let buttonHeight = 0.19 * topSectionHeight;
    let buttonWidth = 0.3333 * wWidth;

    $('#top-half-div').height(topSectionHeight);
    $('.calc-table').height(topSectionHeight);

    $('#bottom-half-div').height(bottomSectionHeight);
    $('.xresults-div').height(bottomSectionHeight);
    $('.calc-display-row').height(buttonHeight);
    $('.calc-button-x').height(buttonHeight);
    $('.calc-button-x').width(buttonWidth);

    if (showCalculator) {
        $('.calc-table>tbody').show();
    } else {
        $('.calc-table>tbody').hide();
    }
}

$(document).ready(function() {
    clearDisplayText();
    clearResults();
    initializeDimensions();
    $( window ).resize(function() {
        initializeDimensions();
    });
});