<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Runway</title>
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" />
</head>
<body>
    <div role="main" class="container">
        <h1>Runway</h1>
        <form name="runwayForm" id="runwayForm">
            <div class="form-group">
                <label for="lumpsuminvestmentamount">Lump sum investment amount</label>
                <input name="lumpsuminvestmentamount" id="lumpsuminvestmentamount" value="0" class="form-control" />
            </div>

            <div class="form-group">
                <label for="annualamount">Annual amount</label>
                <input name="annualamount" id="annualamount" value="0" class="form-control" />
            </div>
            
            <div class="form-group">
                <label for="mininvestmentlevel">Minimal investment level</label>
                <input name="mininvestmentlevel" id="mininvestmentlevel" value="0" class="form-control" />
            </div>

            <div class="form-group">
                <label for="expmarketreturn">Expected market return</label>
                <input name="expmarketreturn" id="expmarketreturn" value="0" class="form-control" />
            </div>

            <button id="calculateButton" class="btn btn-lg btn-primary btn-block" type="button">Calculate</button>
        </form>
    </div>
</body>
</html>