(int dist, string unit) distance;

Console.WriteLine("input distance");
distance.dist = int.Parse(Console.ReadLine());

Console.WriteLine("input units");
distance.unit = Console.ReadLine();

string desiredUnit;

Console.WriteLine("input desired unit");
desiredUnit = Console.ReadLine();

static double ConvertToKilometers((int dist, string unit) distance, string desiredUnit)
{
    double converted;
    if (distance.unit == "m") {
        converted = (double)distance.dist / 1000;
    }
    else if (distance.unit == "cm") {
        converted = (double)distance.dist / 100000;
    } else {
        converted = distance.dist;
    }

    return converted;
}

static double ConvertToMeters((int dist, string unit) distance, string desiredUnit)
{
    double converted;
    if (distance.unit == "km") {
        converted = (double)distance.dist * 1000;
    }
    else if (distance.unit == "cm") {
        converted = (double)distance.dist / 100;
    } else {
        converted = distance.dist;
    }

    return converted;
}
static double ConvertToCentimeters((int dist, string unit) distance, string desiredUnit)
{
    double converted;
    if (distance.unit == "km") {
        converted = (double)distance.dist * 100000;
    }
    else if (distance.unit == "m") {
        converted = (double)distance.dist * 100;
    } else {
        converted = distance.dist;
    }

    return converted;
}

switch (desiredUnit)
{
    case "km":
        Console.WriteLine(ConvertToKilometers(distance, desiredUnit));
        break;
    case "m":
        Console.WriteLine(ConvertToMeters(distance, desiredUnit));
        break;
    case "cm":
        Console.WriteLine(ConvertToCentimeters(distance, desiredUnit));
        break;
    default:
        Console.WriteLine("Invalid unit");
        break;
}