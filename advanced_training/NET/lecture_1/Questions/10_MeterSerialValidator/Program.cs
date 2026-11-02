string again;

do {
    Console.Write("Enter Meter Serial Number: ");
    string serialNumber = Console.ReadLine();

    bool valid = serialNumber.Length == 8 && serialNumber.StartsWith("MTR");

    for (int i = 3; i < serialNumber.Length && valid; i++) {
        if (!char.IsDigit(serialNumber[i])) {
            valid = false;
        }
    }

    Console.WriteLine("Serial Number: " + serialNumber);

    if (valid) {
        Console.WriteLine("Status: Valid");
    } else {
        Console.WriteLine("Status: Invalid");
    }

    Console.Write("Enter another serial number? (yes/no): ");
    again = Console.ReadLine();
} while (again == "yes");
