string correctPassword = "secret";
int attempts = 0;
bool loggedIn = false;

while ((attempts < 3) && (!loggedIn)) {
    Console.Write("Enter password: ");
    string password = Console.ReadLine();
    attempts++;

    if (password == correctPassword) {
        loggedIn = true;
        Console.WriteLine("Login Successful");
    }
}

if (!loggedIn) {
    Console.WriteLine("Account Locked");
}
