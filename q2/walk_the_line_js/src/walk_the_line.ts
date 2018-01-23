const lumpsumInvestmentMonth:HTMLSelectElement = document.getElementById("lumpsuminvestmentmonth") as HTMLSelectElement;
const debitOrderStartMonth:HTMLSelectElement = document.getElementById("debitorderstartmonth") as HTMLSelectElement;

const lumpsumInvestmentAmount:HTMLInputElement = document.getElementById("lumpsuminvestmentamount") as HTMLInputElement;
const debitOrderAmount:HTMLInputElement = document.getElementById("debitorderamount") as HTMLInputElement;

const calculateButton:HTMLButtonElement = document.getElementById("calculateButton") as HTMLButtonElement;

const response:HTMLDivElement = document.getElementById("response") as HTMLDivElement;

const months:Array<string> = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

interface IReturnsObject {
    TotalContributions: number;
    EarliestPermissibleDebitOrderStartMonth: number;
}

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
function calculatePayments(LumpSumInvestmentMonth: number,
    LumpSumInvestmentAmount: number,
    DebitOrderStartMonth: number,
    DebitOrderAmount: number):IReturnsObject {
    let returnObject:IReturnsObject = {
        TotalContributions : 0,
        EarliestPermissibleDebitOrderStartMonth: 1
    };

    let TotalContributionsLimit:number = 30000;

    // financial year ends in Feb
    let FinancialYearEnd:number = 2;

    // convert calendar month (one based) to financial month offset (zero based)
    let LumpSumInvestmentFinancialOffset:number = ((LumpSumInvestmentMonth - FinancialYearEnd + 11) % 12);
    let DebitOrderStartFinancialOffset:number = ((DebitOrderStartMonth - FinancialYearEnd + 11) % 12);

    // note - Spec does not define handling for debit order starting in a month prior to lump sum
    //  - Assume debit order can start first, rather than assume it will start in the next financial year
    //  - Uncomment the following if debit must start after lump sum (debit will be ignored this financial year)
    if (DebitOrderStartFinancialOffset < LumpSumInvestmentFinancialOffset) {
       DebitOrderStartFinancialOffset = 12;
    }

    let DebitOrderInvestmentAmount:number = DebitOrderAmount * (12 - DebitOrderStartFinancialOffset);

    // note - Spec does not define a field indicating invalid application
    //  - Assume TotalContributions can exceed TotalContributionsLimit, and caller will raise/reject
    let TotalContributions:number = LumpSumInvestmentAmount + DebitOrderInvestmentAmount;

    // calculate earliest posible start for debit order without going over the limit
    let DebitOrderMonthCap:number = Math.floor((TotalContributionsLimit - LumpSumInvestmentAmount) / (DebitOrderAmount));
    let EarliestPermissibleDebitOrderStartOffset:number = 12 - DebitOrderMonthCap;

    // convert financial month offset (zero based) to calendar month (one based)
    let EarliestPermissibleDebitOrderStartMonth:number = ((EarliestPermissibleDebitOrderStartOffset + FinancialYearEnd + 12) % 12) + 1;

    if(LumpSumInvestmentMonth === 1 && (TotalContributionsLimit - LumpSumInvestmentAmount) > DebitOrderAmount) {
        EarliestPermissibleDebitOrderStartMonth = 2;
    }

    // end of current tax year, debits can only start in New year
    if(LumpSumInvestmentMonth === 2) {
        EarliestPermissibleDebitOrderStartMonth = 3;
    }

    returnObject.TotalContributions = TotalContributions;
    returnObject.EarliestPermissibleDebitOrderStartMonth = EarliestPermissibleDebitOrderStartMonth;

    return returnObject;
}

//#region Tests
let a:IReturnsObject = calculatePayments(8, 20000, 9, 2500); console.log(a);
let b:IReturnsObject = calculatePayments(8, 20000, 2, 2500); console.log(b);
let c:IReturnsObject = calculatePayments(8, 20000, 3, 2500); console.log(c);
let d:IReturnsObject = calculatePayments(8, 20000, 12, 2500); console.log(d);
let e:IReturnsObject = calculatePayments(5, 12000, 7, 2500); console.log(e);

let f:IReturnsObject = calculatePayments(2, 12000, 7, 2500); console.log(f);
let g:IReturnsObject = calculatePayments(1, 12000, 7, 2500); console.log(g);

let h:IReturnsObject = calculatePayments(1, 12000, 2, 2500); console.log(h);
let i:IReturnsObject = calculatePayments(1, 12000, 3, 2500); console.log(i);

let j:IReturnsObject = calculatePayments(1, 28000, 3, 2500); console.log(j);
let k:IReturnsObject = calculatePayments(1, 28000, 2, 2500); console.log(k);
//#endregion

function loadMonthsToDropDown(element: HTMLSelectElement): void {
    let selectOptions:string = `<option value="">Choose a month</option>`;
    let i:number;

    for(i = 0; i < months.length; i++) {
        selectOptions += `<option value="${i+1}">${months[i]}</option>`;
    }

    element.innerHTML = selectOptions;
}

loadMonthsToDropDown(lumpsumInvestmentMonth);
loadMonthsToDropDown(debitOrderStartMonth);

calculateButton.addEventListener("click", () => {
    let lsMonth:number = parseInt(lumpsumInvestmentMonth.value, 10);
    let lsAmount:number = parseFloat(lumpsumInvestmentAmount.value);

    let dbMonth:number = parseInt(debitOrderStartMonth.value, 10);
    let dbAmount:number = parseFloat(debitOrderAmount.value);

    let finalResult:IReturnsObject = calculatePayments(lsMonth, lsAmount, dbMonth, dbAmount);

    response.innerHTML = JSON.stringify(finalResult);
});
