using System;

/// <summary>
/// Prescient Question 1: FizzBuzz
/// </summary>
namespace fizzbuzz
{
    class Program
    {
        static void Main(string[] args)
        {
            var Start = GetIntFromConsole("Please enter a valid starting number: ", null);
            var End = GetIntFromConsole("Please enter a valid ending number: ", Start);

            for (int i = Start; i <= End; i++)
            {
                if(i % 3 == 0 && i % 5 == 0)
                {
                    Console.WriteLine("FizzBuzz");
                } else if(i % 3 == 0)
                {
                    Console.WriteLine("Fizz");
                } else if(i % 5 == 0)
                {
                    Console.WriteLine("Buzz");
                } else
                {
                    Console.WriteLine(i.ToString());
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="prompt">The copy the user sees when prompted</param>
        /// <param name="lowest">The minimum value the program will accept</param>
        /// <returns></returns>
        private static int GetIntFromConsole(string prompt, int? lowest)
        {
            var input = default(string);
            var value = default(int);

            while (true)
            {
                Console.WriteLine(prompt);
                input = Console.ReadLine();

                if(int.TryParse(input, out value))
                {
                    if (lowest == null || value >= lowest)
                    {
                        return value;
                    }

                    prompt = string.Format("Please enter a number greater than {0}: ", lowest.ToString());

                } else
                {
                    Console.WriteLine("Invalid number entered!");
                }
            }
        }
    }
}
 