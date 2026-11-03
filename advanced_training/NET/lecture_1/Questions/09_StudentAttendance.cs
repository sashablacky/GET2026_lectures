string[] students = ["Rahul", "Priya", "Akash", "Sneha", "Kiran"];
int number = 1;

Console.WriteLine("Student Attendance List");

foreach (string student in students) {
    Console.WriteLine(number + ". " + student);
    number++;
}

Console.WriteLine("Total Students: " + students.Length);
