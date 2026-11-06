Student first = new Student("Ava Patel", 20, "12 Oak Street", 1001, "Computer Science", 91.5);
Student second = new Student("Noah Kim", 22, "48 Pine Avenue", 1002, "Mathematics", 87.0);

DisplayStudent(first);
DisplayStudent(second);


static void DisplayStudent(Student student)
{
    Console.WriteLine($"Name: {student.Name}, Age: {student.Age}, Address: {student.Address}, " +
                        $"Register Number: {student.RegisterNumber}, Course: {student.Course}, Marks: {student.Marks}");
}
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Address { get; set; }

    public Person(string name, int age, string address)
    {
        Name = name;
        Age = age;
        Address = address;
    }
}

class Student : Person
{
    public int RegisterNumber { get; set; }
    public string Course { get; set; }
    public double Marks { get; set; }

    public Student(string name, int age, string address, int registerNumber, string course, double marks)
        : base(name, age, address)
    {
        RegisterNumber = registerNumber;
        Course = course;
        Marks = marks;
    }
}
