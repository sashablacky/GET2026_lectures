

Student student1 = new Student("Aarav", 101, "Computer Science");
Student student2 = new Student("Maya", 102, "Mathematics");
Student student3 = new Student("Noah", 103, "Physics");

student1.DisplayDetails();
student2.DisplayDetails();
student3.DisplayDetails();
class Student
{
    public string Name { get; set; }
    public int RegisterNumber { get; set; }
    public string Department { get; set; }

    public Student(string name, int registerNumber, string department)
    {
        this.Name = name;
        this.RegisterNumber = registerNumber;
        this.Department = department;
    }

    public Student createStudent(string name, int registerNumber, string department)
    {
        return new Student(name, registerNumber, department);
    }

    public void DisplayDetails()
    {
        Console.WriteLine($"Name: {Name}, RegisterNumber {RegisterNumber}, Department {Department}");
    }
}