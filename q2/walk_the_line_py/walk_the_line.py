#!/usr/bin/env python3

def tfsa_calculate(LumpSumInvestmentMonth, LumpSumInvestmentAmount, DebitOrderStartMonth, DebitOrderAmount):
    TotalContributionsLimit = 30000
    # Financial year ends in Feb
    FinancialYearEnd = 2
    # Convert calendar month (one based) to financial month offset (zero based)
    LumpSumInvestmentFinancialOffset = ((LumpSumInvestmentMonth - FinancialYearEnd + 11) % 12)
    DebitOrderStartFinancialOffset = ((DebitOrderStartMonth - FinancialYearEnd + 11) % 12)
    # NOTE - Spec does not define handling for debit order starting in a month prior to lump sum
    #  - Assume debit order can start first, rather than assume it will start in the next financial year
    #  - Uncomment the following if debit must start after lump sum (debit will be ignored this financial year)
    if DebitOrderStartFinancialOffset < LumpSumInvestmentFinancialOffset:
        DebitOrderStartFinancialOffset = 12
    DebitOrderInvestmentAmount = DebitOrderAmount * (12 - DebitOrderStartFinancialOffset)
    # NOTE - Spec does not define a field indicating invalid application
    #  - Assume TotalContributions can exceed TotalContributionsLimit, and caller will raise/reject
    TotalContributions = LumpSumInvestmentAmount + DebitOrderInvestmentAmount
    # Calculate earliest posible start for debit order without going over the limit
    DebitOrderMonthCap = (TotalContributionsLimit - LumpSumInvestmentAmount) // (DebitOrderAmount)
    EarliestPermissibleDebitOrderStartOffset = 12 - DebitOrderMonthCap
    # Convert financial month offset (zero based) to calendar month (one based)
    EarliestPermissibleDebitOrderStartMonth = ((EarliestPermissibleDebitOrderStartOffset + FinancialYearEnd + 12) % 12) + 1
    
    if LumpSumInvestmentMonth == 1 and (TotalContributionsLimit - LumpSumInvestmentAmount) > DebitOrderAmount:
        EarliestPermissibleDebitOrderStartMonth = 2
    
    if LumpSumInvestmentMonth == 2:
        EarliestPermissibleDebitOrderStartMonth = 3
    
    return (TotalContributions, EarliestPermissibleDebitOrderStartMonth)

def run():
    tfsa_result = tfsa_calculate(8, 20000, 9, 2500)
    print(tfsa_result)
    tfsa_result = tfsa_calculate(11, 15000, 9, 2500)
    print(tfsa_result)
    tfsa_result = tfsa_calculate(8, 20000, 11, 2500)
    print(tfsa_result)
    tfsa_result = tfsa_calculate(2, 12000, 7, 2500)
    print(tfsa_result)
    tfsa_result = tfsa_calculate(1, 12000, 3, 2500)
    print(tfsa_result)


if __name__ == '__main__':
    run()
