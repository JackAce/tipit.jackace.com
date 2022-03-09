
function getDisplayText() {
    let returnValue = $('#calc-display-x').text();
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
    // Min tip at 4% tip
    let startAmount = parseInt(billAmountInCents * 0.04);
    // Max cap at 31% tip
    let stopAmount = parseInt(billAmountInCents * 0.31);

    // Loop through every possible tip amount, incrementing by a penny
    for (let i = startAmount; i <= stopAmount; i++) {
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
    //console.log('You pressed: ' + number);

    //initializeDimensions();
    // console.log('width: ' + $(window).width());
    // console.log('height: ' + $(window).height());

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
    //console.log('You pressed: .');

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
    //console.log('You pressed: BACKSPACE');

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
    setCalculatorDisplay(true);
    performCalculations();
    //console.log('CLEARED');
}

function clearResults() {
    $('#calc-results-footer>tr').remove();
    //$('#calc-results-footer > tr').remove();
    //$('.results-table-scroll>tfoot').hide();
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
        let cssClass = "calc-result ";
        let tipPercent = resultArray[i].tipPercent;
        let html = '<tr class="' + cssClass + '">';

        html += '<td>';
        html += '<div class="tip-percent" percent="' + tipPercent + '">';
        html += formatDecimal(tipPercent) + '%';
        html += '</div>';
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
    //console.log(returnValue + ' for ${tipPercent}');
    return returnValue;
}

function refreshTipColors() {
    $('.tip-percent').each(function () {
        let percent = parseFloat($(this).attr('percent'));

        //console.log('percent: ' + percent);
        $(this).css('background-color', getColorForPercent(percent));
        //$(this).css('color', '#000');
    });
}

function toggleCalcDisplay() {
    setCalculatorDisplay(!isCalculatorVisible());
}

function setCalculatorDisplay(showCalculator) {
    if (showCalculator) {
        $('#top-half-div').attr('class', 'show-calculator');
    } else {
        $('#top-half-div').attr('class', null);
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
    //console.log('calc.js loaded via document ready!!!');

    $( window ).resize(function() {
        initializeDimensions();
    });
});