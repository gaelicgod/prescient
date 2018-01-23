#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prescient Question 1: FizzBuzz

"""

def get_int_from_console(prompt, lowest=None):
    """
    Method to return an integer from the user prompt.

    """
    value = 0
    while True:
        try:
            value = int(input(prompt))
        except ValueError:
            print("Invalid number entered!")
            continue
        else:
            if lowest is None or value >= lowest:
                break

            prompt = "Please enter a number greater than " + str(lowest) + ": "
            continue

    return value

def main():
    """
    Main method of program, contains FizzBuzz logic

    """
    start = get_int_from_console("Please enter a valid starting number: ")
    end = get_int_from_console("Please enter a valid ending number: ", lowest=start)

    for i in range(start, end+1):
        if i % 3 == 0 and i % 5 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(str(i))


if __name__ == "__main__":
    main()
