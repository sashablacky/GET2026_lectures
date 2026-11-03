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
