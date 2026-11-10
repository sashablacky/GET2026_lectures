using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace razor_pages.Pages;

// Task 6: Electricity Bill Calculator
public class ElectricityBillModel : PageModel
{
    private const decimal FirstSlabRate = 2m;   // units 1-100
    private const decimal SecondSlabRate = 3m;  // units 101-200
    private const decimal ThirdSlabRate = 5m;   // units above 200
    private const int SlabSize = 100;

    [BindProperty]
    public string? CustomerName { get; set; }

    [BindProperty]
    public string? MeterNumber { get; set; }

    [BindProperty]
    public int? UnitsConsumed { get; set; }

    public decimal? BillAmount { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public void OnGet()
    {
    }

    public void OnPost()
    {
        if (string.IsNullOrWhiteSpace(CustomerName) || string.IsNullOrWhiteSpace(MeterNumber))
        {
            ErrorMessage = "Customer Name and Meter Number are required.";
            return;
        }
        if (UnitsConsumed is null)
        {
            ErrorMessage = "Please enter a valid whole number of units.";
            return;
        }
        if (UnitsConsumed < 0)
        {
            ErrorMessage = "Units consumed cannot be negative.";
            return;
        }

        BillAmount = CalculateBill(UnitsConsumed.Value);
    }

    private static decimal CalculateBill(int units)
    {
        int firstSlabUnits = Math.Min(units, SlabSize);
        int secondSlabUnits = Math.Clamp(units - SlabSize, 0, SlabSize);
        int thirdSlabUnits = Math.Max(units - 2 * SlabSize, 0);

        return firstSlabUnits * FirstSlabRate
             + secondSlabUnits * SecondSlabRate
             + thirdSlabUnits * ThirdSlabRate;
    }
}
