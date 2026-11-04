List<string> participants = new();

participants.Add("Maria");
participants.Add("John");
participants.Add("Alex");
participants.Add("Mike");
participants.Add("Anna");

participants.Remove("John");

Console.WriteLine("All participants:");
foreach (var p in participants)
    Console.WriteLine(p);

Console.WriteLine($"\nTotal registrations: {participants.Count}");

int index = 1;
Console.WriteLine($"Participant at index {index}: {participants[index]}");

Console.WriteLine("\nSorted:");
foreach (var p in participants.OrderBy(p => p))
    Console.WriteLine(p);

char letter = 'A';
Console.WriteLine($"\nNames starting with {letter}:");
foreach (var p in participants.Where(p => p.StartsWith(letter)))
    Console.WriteLine(p);
