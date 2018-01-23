var lumpsumInvestmentMonth = document.getElementById("lumpsuminvestmentmonth");
var debitOrderStartMonth = document.getElementById("debitorderstartmonth");
var lumpsumInvestmentAmount = document.getElementById("lumpsuminvestmentamount");
var debitOrderAmount = document.getElementById("debitorderamount");
var calculateButton = document.getElementById("calculateButton");
var response = document.getElementById("response");
var months = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];
/**
 * Method for determining how long the investment would provide
 * a payout for
 *
 * @param {number} LumpSumInvestmentMonth
 * @param {number} LumpSumInvestmentAmount
 * @param {number} DebitOrderStartMonth
 * @param {number} DebitOrderAmount
 *
 * @returns {object}
 */
function calculatePayments(LumpSumInvestmentMonth, LumpSumInvestmentAmount, DebitOrderStartMonth, DebitOrderAmount) {
    var returnObject = {
        TotalContributions: 0,
        EarliestPermissibleDebitOrderStartMonth: 1
    };
    var TotalContributionsLimit = 30000;
    // financial year ends in Feb
    var FinancialYearEnd = 2;
    // convert calendar month (one based) to financial month offset (zero based)
    var LumpSumInvestmentFinancialOffset = ((LumpSumInvestmentMonth - FinancialYearEnd + 11) % 12);
    var DebitOrderStartFinancialOffset = ((DebitOrderStartMonth - FinancialYearEnd + 11) % 12);
    if (DebitOrderStartFinancialOffset < LumpSumInvestmentFinancialOffset) {
        DebitOrderStartFinancialOffset = 12;
    }
    var DebitOrderInvestmentAmount = DebitOrderAmount * (12 - DebitOrderStartFinancialOffset);
    // note - Spec does not define a field indicating invalid application
    //  - Assume TotalContributions can exceed TotalContributionsLimit, and caller will raise/reject
    var TotalContributions = LumpSumInvestmentAmount + DebitOrderInvestmentAmount;
    // calculate earliest posible start for debit order without going over the limit
    var DebitOrderMonthCap = Math.floor((TotalContributionsLimit - LumpSumInvestmentAmount) / (DebitOrderAmount));
    var EarliestPermissibleDebitOrderStartOffset = 12 - DebitOrderMonthCap;
    // convert financial month offset (zero based) to calendar month (one based)
    var EarliestPermissibleDebitOrderStartMonth = ((EarliestPermissibleDebitOrderStartOffset + FinancialYearEnd + 12) % 12) + 1;
    if (LumpSumInvestmentMonth === 1 && (TotalContributionsLimit - LumpSumInvestmentAmount) > DebitOrderAmount) {
        EarliestPermissibleDebitOrderStartMonth = 2;
    }
    // end of current tax year, debits can only start in New year
    if (LumpSumInvestmentMonth === 2) {
        EarliestPermissibleDebitOrderStartMonth = 3;
    }
    returnObject.TotalContributions = TotalContributions;
    returnObject.EarliestPermissibleDebitOrderStartMonth = EarliestPermissibleDebitOrderStartMonth;
    return returnObject;
}
//#region Tests
// let a:IReturnsObject = calculatePayments(8, 20000, 9, 2500); console.log(a);
// let b:IReturnsObject = calculatePayments(8, 20000, 2, 2500); console.log(b);
// let c:IReturnsObject = calculatePayments(8, 20000, 3, 2500); console.log(c);
// let d:IReturnsObject = calculatePayments(8, 20000, 12, 2500); console.log(d);
// let e:IReturnsObject = calculatePayments(5, 12000, 7, 2500); console.log(e);
// let f:IReturnsObject = calculatePayments(2, 12000, 7, 2500); console.log(f);
// let g:IReturnsObject = calculatePayments(1, 12000, 7, 2500); console.log(g);
// let h:IReturnsObject = calculatePayments(1, 12000, 2, 2500); console.log(h);
// let i:IReturnsObject = calculatePayments(1, 12000, 3, 2500); console.log(i);
// let j:IReturnsObject = calculatePayments(1, 28000, 3, 2500); console.log(j);
// let k:IReturnsObject = calculatePayments(1, 28000, 2, 2500); console.log(k);
//#endregion
function loadMonthsToDropDown(element) {
    var selectOptions = "<option value=\"\">Choose a month</option>";
    var i;
    for (i = 0; i < months.length; i++) {
        selectOptions += "<option value=\"" + (i + 1) + "\">" + months[i] + "</option>";
    }
    element.innerHTML = selectOptions;
}
loadMonthsToDropDown(lumpsumInvestmentMonth);
loadMonthsToDropDown(debitOrderStartMonth);
function removeSpaces(value) {
    value = value.replace(" ", "");
    return value;
}
function isValidValue(value) {
    if (value !== "" && value >= 0) {
        return true;
    }
    return false;
}
calculateButton.addEventListener("click", function () {
    var lsMonth = parseInt(lumpsumInvestmentMonth.value, 10);
    var lsAmount = parseFloat(removeSpaces(lumpsumInvestmentAmount.value));
    var dbMonth = parseInt(debitOrderStartMonth.value, 10);
    var dbAmount = parseFloat(removeSpaces(debitOrderAmount.value));
    if (isValidValue(lsMonth) && isValidValue(lsAmount) && isValidValue(dbMonth) && isValidValue(dbAmount)) {
        var finalResult = calculatePayments(lsMonth, lsAmount, dbMonth, dbAmount);
        response.innerHTML = JSON.stringify(finalResult);
    }
    else {
        response.innerHTML = "Please enter valid values";
    }
});
