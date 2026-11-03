Console.Write("Enter student name: ");
string studentName = Console.ReadLine();

Console.Write("Enter marks in Subject 1: ");
int subject1 = int.Parse(Console.ReadLine());

Console.Write("Enter marks in Subject 2: ");
int subject2 = int.Parse(Console.ReadLine());

Console.Write("Enter marks in Subject 3: ");
int subject3 = int.Parse(Console.ReadLine());

int total = subject1 + subject2 + subject3;
double average = total / 3.0;

Console.WriteLine("Student Name: " + studentName);
Console.WriteLine("Total Marks: " + total);
Console.WriteLine("Average: " + average);

// result based on three subjects marks pass if >= 75 all subjects otherwise fail
char gradeMark = average >= 90 ? 'A' :
                 average >= 80 ? 'B' :
                 average >= 70 ? 'C' :
                 average >= 60 ? 'D' :
                 average >= 50 ? 'E' : 'F';


bool isPass = subject1 >= 75 && subject2 >= 75 && subject3 >= 75;
if (isPass) {
    Console.WriteLine($"Result: Pass Grade: {gradeMark}");
} else {
    Console.WriteLine("Result: Fail");
}

