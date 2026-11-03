string sentance;

Console.WriteLine("Enter a sentance: ");
sentance = Console.ReadLine();

sentance = sentance.Trim();
Console.WriteLine(sentance);

string sentanceUpper = sentance.ToUpper();
Console.WriteLine(sentanceUpper);

string sentanceLower = sentance.ToLower();
Console.WriteLine(sentanceLower);

string replacedWord = sentance.Replace("Hello", "Hi");
Console.WriteLine(replacedWord);

Console.WriteLine("Enter a word to find: ");
string wordToFind = Console.ReadLine();
Console.WriteLine($"The word '{wordToFind}' is found at index: {sentance.IndexOf(wordToFind)}");

