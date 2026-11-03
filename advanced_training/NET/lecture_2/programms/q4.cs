(string name, string surname, int age) person;

Console.WriteLine("Enter your name:");
person.name = Console.ReadLine();

Console.WriteLine("Enter your surname:");
person.surname = Console.ReadLine();

Console.WriteLine("Enter your age:");
person.age = int.Parse(Console.ReadLine());

Console.WriteLine(string.Join("", string.Concat(person.name.Replace(" ", "").Reverse()), string.Concat(person.surname.Replace(" ", "").Reverse()), person.age.ToString()));