<?php
/**
 * Prescient Question 1: FizzBuzz
 * PHP version 7
 * 
 * @category Assessments
 * @package  Assessments
 * @author   Bevan Christians <gaelicgod@gmail.com>
 * @license  http://opensource.org/licenses/gpl-license.php GNU Public License
 */

/**
 * Returns an integer based on the user prompt
 *
 * @param string $prompt The copy the user sees when prompted
 * @param int    $lowest The minimum value the program will accept
 * 
 * @return int
 */
function Get_Int_From_console(string $prompt, $lowest = null) 
{
    $value = 0; 
    while (true) {
        print $prompt;
    
        $value = fgets(STDIN);

        if (filter_var($value, FILTER_VALIDATE_INT) === 0 || filter_var($value, FILTER_VALIDATE_INT)) {
            if ($lowest === null || (int)$value >= $lowest) {
                break;
            } else {
                $prompt = "Please enter a number greater than " . $lowest . ": ";
            }
        } else {
            print "Invalid number entered!\r\n";
        }
    }
    
    return (int)$value;
}

$start = Get_Int_From_console("Please enter a valid starting number: ");
$end = Get_Int_From_console("Please enter a valid ending number: ", $start);

for ($i = $start; $i <= $end; $i++) {

    if ($i % 3 === 0 && $i % 5 === 0) {
        print "FizzBuzz\r\n";
    } elseif ($i % 3 === 0) {
        print "Fizz\r\n";
    } elseif ($i % 5 === 0) {
        print "Buzz\r\n";
    } else {
        print "$i\r\n";
    }
}