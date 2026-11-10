using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace razor_pages.Pages;

// Task 3: Simple Calculator
public class CalculatorModel : PageModel
{
    [BindProperty]
    public double FirstNumber { get; set; }

    [BindProperty]
    public double SecondNumber { get; set; }

    [BindProperty]
    public string Operation { get; set; } = "Add";

    public double? Result { get; set; }
    public string Message { get; set; } = string.Empty;

    public void OnGet()
    {
    }

    public void OnPost()
    {
        switch (Operation)
        {
            case "Add":
                Result = FirstNumber + SecondNumber;
                break;
            case "Subtract":
                Result = FirstNumber - SecondNumber;
                break;
            case "Multiply":
                Result = FirstNumber * SecondNumber;
                break;
            case "Divide":
                if (SecondNumber == 0)
                {
                    Message = "Cannot divide by zero.";
                }
                else
                {
                    Result = FirstNumber / SecondNumber;
                }
                break;
            default:
                Message = "Please select a valid operation.";
                break;
        }
    }
}
