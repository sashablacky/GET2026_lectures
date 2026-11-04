Console.Write("Enter a sentence: ");
string sentence = Console.ReadLine()!;

Console.Write("Enter a search word: ");
string word = Console.ReadLine()!.Trim().ToLower();

sentence = sentence.Trim();
sentence = sentence.ToLower();

Console.WriteLine($"\nContains \"{word}\": {sentence.Contains(word)}");
Console.WriteLine($"Starts with \"{word}\": {sentence.StartsWith(word)}");
Console.WriteLine($"Ends with \"{word}\": {sentence.EndsWith(word)}");

Console.Write("\nWord to replace: ");
string oldWord = Console.ReadLine()!.Trim().ToLower();
Console.Write("Replace with: ");
string newWord = Console.ReadLine()!.Trim();

sentence = sentence.Replace(oldWord, newWord);

Console.WriteLine($"\nModified sentence: {sentence}");
