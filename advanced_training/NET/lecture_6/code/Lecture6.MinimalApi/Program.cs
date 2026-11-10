var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var links = new List<ShortLink>();
var parkingSlots = new List<ParkingSlot>
{
    new() { SlotNumber = 1, VehicleNumber = "AA-111", IsOccupied = true },
    new() { SlotNumber = 2, VehicleNumber = null, IsOccupied = false },
    new() { SlotNumber = 3, VehicleNumber = "BB-222", IsOccupied = true },
    new() { SlotNumber = 4, VehicleNumber = null, IsOccupied = false }
};
var parcels = new List<Parcel>
{
    new() { TrackingNumber = "PKG-1", Sender = "Book Shop", Receiver = "Mina", CurrentLocation = "Depot", Status = "Created" },
    new() { TrackingNumber = "PKG-2", Sender = "Food Shop", Receiver = "Arun", CurrentLocation = "Sorting Center", Status = "InTransit" },
    new() { TrackingNumber = "PKG-3", Sender = "Gift Shop", Receiver = "Lee", CurrentLocation = "Local Depot", Status = "OutForDelivery" }
};
var quizQuestions = new List<QuizQuestion>
{
    new() { Id = 1, Question = "What is ASP.NET Core?", Options = new[] { "A framework", "A database", "A browser", "A phone" }, CorrectAnswer = "A framework" },
    new() { Id = 2, Question = "Which verb is used to create data?", Options = new[] { "GET", "POST", "PATCH", "DELETE" }, CorrectAnswer = "POST" },
    new() { Id = 3, Question = "What does LINQ query?", Options = new[] { "Collections", "Images", "Ports", "Files" }, CorrectAnswer = "Collections" },
    new() { Id = 4, Question = "Which file contains Razor markup?", Options = new[] { ".cshtml", ".json", ".dll", ".css" }, CorrectAnswer = ".cshtml" },
    new() { Id = 5, Question = "Which status means not found?", Options = new[] { "200", "201", "404", "500" }, CorrectAnswer = "404" }
};
var passes = new List<BusPass>
{
    new() { PassNumber = "PASS-1001", PassengerName = "Maya", PassType = "Student", StartDate = DateTime.Today.AddDays(-5), EndDate = DateTime.Today.AddDays(25), IsActive = true },
    new() { PassNumber = "PASS-1002", PassengerName = "Noah", PassType = "Monthly", StartDate = DateTime.Today, EndDate = DateTime.Today.AddDays(30), IsActive = true },
    new() { PassNumber = "PASS-1003", PassengerName = "Ari", PassType = "Daily", StartDate = DateTime.Today.AddDays(-10), EndDate = DateTime.Today.AddDays(-9), IsActive = false }
};
var recipes = new List<Recipe>
{
    new() { Id = 1, Name = "Salad", Cuisine = "Greek", PreparationMinutes = 10, Ingredients = new[] { "Tomato", "Cucumber", "Olive" } },
    new() { Id = 2, Name = "Pasta", Cuisine = "Italian", PreparationMinutes = 20, Ingredients = new[] { "Tomato", "Pasta", "Garlic" } }
};
var wallets = new List<Wallet>
{
    new() { Id = 1, Balance = 200m },
    new() { Id = 2, Balance = 100m }
};
var walletTransactions = new List<WalletTransaction>();
var screenings = new List<Screening>
{
    new() { Id = 1, MovieTitle = "Movie A", ShowTime = "18:00", Seats = new[] { new Seat { Number = 1, IsReserved = false }, new Seat { Number = 2, IsReserved = true } } },
    new() { Id = 2, MovieTitle = "Movie B", ShowTime = "20:00", Seats = new[] { new Seat { Number = 1, IsReserved = false }, new Seat { Number = 2, IsReserved = false } } }
};
var polls = new List<Poll>
{
    new() { Id = 1, Question = "Favorite language?", Options = new[] { "C#", "Java", "Python" }, IsOpen = true, Votes = new List<PollVote>() },
    new() { Id = 2, Question = "Do you like homework?", Options = new[] { "Yes", "No" }, IsOpen = false, Votes = new List<PollVote>() }
};
var workshops = new List<Workshop>
{
    new() { Id = 1, Title = "ASP.NET Core Basics", Speaker = "Sam", Date = DateTime.Today.AddDays(5) },
    new() { Id = 2, Title = "Razor Pages", Speaker = "Anna", Date = DateTime.Today.AddDays(7) }
};
var workshopRegistrations = new List<WorkshopRegistration>();

app.MapGet("/", () => "Lecture 6 API works");

app.MapGet("/links", () => links);
app.MapPost("/links", (CreateLinkRequest request) =>
{
    var code = CreateCode(links);
    var item = new ShortLink
    {
        Id = links.Count + 1,
        OriginalUrl = request.OriginalUrl,
        ShortCode = code,
        CreatedAt = DateTime.Now,
        IsActive = true
    };
    links.Add(item);
    return Results.Ok(item);
});
app.MapGet("/links/{code}", (string code) =>
{
    var item = links.FirstOrDefault(x => x.ShortCode == code);
    return item == null ? Results.NotFound() : Results.Ok(item);
});
app.MapPatch("/links/{code}/deactivate", (string code) =>
{
    var item = links.FirstOrDefault(x => x.ShortCode == code);
    if (item == null) return Results.NotFound();
    item.IsActive = false;
    return Results.Ok(item);
});

app.MapGet("/parking/slots", () => parkingSlots);
app.MapGet("/parking/available", () => parkingSlots.Where(x => !x.IsOccupied).ToList());
app.MapPost("/parking/assign", (ParkingRequest request) =>
{
    if (parkingSlots.Any(x => x.VehicleNumber == request.VehicleNumber))
    {
        return Results.Conflict();
    }

    var free = parkingSlots.FirstOrDefault(x => !x.IsOccupied);
    if (free == null) return Results.Conflict();
    free.VehicleNumber = request.VehicleNumber;
    free.IsOccupied = true;
    return Results.Ok(free);
});
app.MapPost("/parking/release/{slotNumber:int}", (int slotNumber) =>
{
    var slot = parkingSlots.FirstOrDefault(x => x.SlotNumber == slotNumber);
    if (slot == null) return Results.NotFound();
    if (!slot.IsOccupied) return Results.Conflict();
    slot.VehicleNumber = null;
    slot.IsOccupied = false;
    return Results.Ok(slot);
});

app.MapGet("/parcels/{trackingNumber}", (string trackingNumber) =>
{
    var item = parcels.FirstOrDefault(x => x.TrackingNumber == trackingNumber);
    return item == null ? Results.NotFound() : Results.Ok(item);
});
app.MapGet("/parcels/status/{status}", (string status) =>
    parcels.Where(x => x.Status.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList());
app.MapPost("/parcels", (CreateParcelRequest request) =>
{
    var item = new Parcel
    {
        TrackingNumber = "PKG-" + (parcels.Count + 1),
        Sender = request.Sender,
        Receiver = request.Receiver,
        CurrentLocation = request.CurrentLocation,
        Status = "Created"
    };
    parcels.Add(item);
    return Results.Ok(item);
});
app.MapPatch("/parcels/{trackingNumber}/status", (string trackingNumber, UpdateParcelStatusRequest request) =>
{
    var item = parcels.FirstOrDefault(x => x.TrackingNumber == trackingNumber);
    if (item == null) return Results.NotFound();

    var allowedNextStatuses = item.Status switch
    {
        "Created" => new[] { "Dispatched" },
        "Dispatched" => new[] { "InTransit" },
        "InTransit" => new[] { "OutForDelivery", "Delivered" },
        "OutForDelivery" => new[] { "Delivered" },
        _ => Array.Empty<string>()
    };

    if (!allowedNextStatuses.Contains(request.Status, StringComparer.OrdinalIgnoreCase))
    {
        return Results.Conflict();
    }

    item.Status = request.Status;
    return Results.Ok(item);
});

app.MapGet("/quiz/questions", () => quizQuestions.Select(x => new
{
    x.Id,
    x.Question,
    x.Options
}));
app.MapPost("/quiz/submit", (List<QuizSubmitRequest> answers) =>
{
    if (answers.Count == 0) return Results.BadRequest();

    var score = 0;
    foreach (var answer in answers)
    {
        var question = quizQuestions.FirstOrDefault(x => x.Id == answer.QuestionId);
        if (question == null || !question.Options.Contains(answer.SelectedAnswer))
            return Results.BadRequest();

        if (question.CorrectAnswer == answer.SelectedAnswer) score++;
    }
    return Results.Ok(new { Score = score, Total = answers.Count, Percentage = score * 100d / answers.Count });
});

app.MapGet("/passes/active", () => passes.Where(x => x.IsActive).ToList());
app.MapGet("/passes/{passNumber}", (string passNumber) =>
{
    var pass = passes.FirstOrDefault(x => x.PassNumber == passNumber);
    return pass == null ? Results.NotFound() : Results.Ok(pass);
});
app.MapPost("/passes", (CreatePassRequest request) =>
{
    if (request.EndDate < request.StartDate) return Results.BadRequest();

    var item = new BusPass
    {
        PassNumber = "PASS-" + (1001 + passes.Count),
        PassengerName = request.PassengerName,
        PassType = request.PassType,
        StartDate = request.StartDate,
        EndDate = request.EndDate,
        IsActive = true
    };
    passes.Add(item);
    return Results.Created($"/passes/{item.PassNumber}", item);
});
app.MapPatch("/passes/{passNumber}/cancel", (string passNumber) =>
{
    var item = passes.FirstOrDefault(x => x.PassNumber == passNumber);
    if (item == null) return Results.NotFound();
    item.IsActive = false;
    return Results.Ok(item);
});

app.MapGet("/recipes", (string? ingredient, int? maxMinutes) =>
{
    var matchingRecipes = recipes.AsEnumerable();
    if (!string.IsNullOrWhiteSpace(ingredient))
    {
        matchingRecipes = matchingRecipes.Where(x =>
            x.Ingredients.Any(i => i.Contains(ingredient, StringComparison.OrdinalIgnoreCase)));
    }

    if (maxMinutes.HasValue)
    {
        if (maxMinutes <= 0) return Results.BadRequest();
        matchingRecipes = matchingRecipes.Where(x => x.PreparationMinutes <= maxMinutes);
    }

    return Results.Ok(matchingRecipes.ToList());
});
app.MapGet("/recipes/{id:int}", (int id) =>
{
    var item = recipes.FirstOrDefault(x => x.Id == id);
    return item == null ? Results.NotFound() : Results.Ok(item);
});

app.MapGet("/wallets/{id:int}", (int id) =>
{
    var wallet = wallets.FirstOrDefault(x => x.Id == id);
    return wallet == null
        ? Results.NotFound()
        : Results.Ok(new { wallet.Id, wallet.Balance, Transactions = walletTransactions.Where(x => x.WalletId == id) });
});
app.MapPost("/wallets/{id:int}/deposit", (int id, WalletOperationRequest request) =>
{
    var wallet = wallets.FirstOrDefault(x => x.Id == id);
    if (wallet == null) return Results.NotFound();
    if (request.Amount <= 0) return Results.BadRequest();
    wallet.Balance += request.Amount;
    walletTransactions.Add(new WalletTransaction { WalletId = id, Type = "Deposit", Amount = request.Amount, Date = DateTime.Now });
    return Results.Ok(wallet);
});
app.MapPost("/wallets/{id:int}/withdraw", (int id, WalletOperationRequest request) =>
{
    var wallet = wallets.FirstOrDefault(x => x.Id == id);
    if (wallet == null) return Results.NotFound();
    if (request.Amount <= 0) return Results.BadRequest();
    if (request.Amount > wallet.Balance) return Results.Conflict();
    wallet.Balance -= request.Amount;
    walletTransactions.Add(new WalletTransaction { WalletId = id, Type = "Withdrawal", Amount = request.Amount, Date = DateTime.Now });
    return Results.Ok(wallet);
});

app.MapGet("/screenings", () => screenings);
app.MapGet("/screenings/{id:int}/seats", (int id) =>
{
    var item = screenings.FirstOrDefault(x => x.Id == id);
    return item == null ? Results.NotFound() : Results.Ok(item.Seats);
});
app.MapPost("/screenings/{id:int}/reserve", (int id, ReserveRequest request) =>
{
    var item = screenings.FirstOrDefault(x => x.Id == id);
    if (item == null) return Results.NotFound();

    if (request.SeatNumbers.Any(number => !item.Seats.Any(seat => seat.Number == number)))
        return Results.BadRequest();

    if (request.SeatNumbers.Any(number => item.Seats.First(seat => seat.Number == number).IsReserved))
        return Results.Conflict();

    foreach (var seatNumber in request.SeatNumbers)
    {
        item.Seats.First(seat => seat.Number == seatNumber).IsReserved = true;
    }

    return Results.Ok(item);
});

app.MapGet("/polls", () => polls);
app.MapGet("/polls/{id:int}/results", (int id) =>
{
    var poll = polls.FirstOrDefault(x => x.Id == id);
    if (poll == null) return Results.NotFound();
    var totalVotes = poll.Votes.Count;
    var results = poll.Options.Select(option =>
    {
        var count = poll.Votes.Count(vote => vote.Option == option);
        return new { Option = option, VoteCount = count, Percentage = totalVotes == 0 ? 0 : count * 100d / totalVotes };
    });
    return Results.Ok(new { poll.Id, poll.Question, TotalVotes = totalVotes, Results = results });
});
app.MapPost("/polls/{id:int}/vote", (int id, VoteRequest request) =>
{
    var poll = polls.FirstOrDefault(x => x.Id == id);
    if (poll == null) return Results.NotFound();
    if (!poll.IsOpen) return Results.Conflict();
    if (!poll.Options.Contains(request.Option)) return Results.BadRequest();
    poll.Votes.Add(new PollVote { PollId = id, Option = request.Option });
    return Results.Ok(poll);
});

app.MapGet("/workshops", () => workshops);
app.MapGet("/workshops/{id:int}", (int id) =>
{
    var item = workshops.FirstOrDefault(x => x.Id == id);
    return item == null ? Results.NotFound() : Results.Ok(item);
});
app.MapPost("/workshops/{id:int}/register", (int id, WorkshopRegistrationRequest request) =>
{
    var workshop = workshops.FirstOrDefault(x => x.Id == id);
    if (workshop == null) return Results.NotFound();
    if (string.IsNullOrWhiteSpace(request.ParticipantName) || string.IsNullOrWhiteSpace(request.Email))
        return Results.BadRequest(new { message = "Name and email are required." });

    var registration = new WorkshopRegistration
    {
        WorkshopId = id,
        ParticipantName = request.ParticipantName,
        Email = request.Email
    };
    workshopRegistrations.Add(registration);
    return Results.Ok(registration);
});

app.Run();

static string CreateCode(List<ShortLink> links)
{
    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    string code;
    do
    {
        code = new string(Enumerable.Range(0, 6).Select(_ => chars[Random.Shared.Next(chars.Length)]).ToArray());
    }
    while (links.Any(link => link.ShortCode == code));

    return code;
}

public class ShortLink
{
    public int Id { get; set; }
    public string OriginalUrl { get; set; } = "";
    public string ShortCode { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}

public class ParkingSlot
{
    public int SlotNumber { get; set; }
    public string? VehicleNumber { get; set; }
    public bool IsOccupied { get; set; }
}

public class Parcel
{
    public string TrackingNumber { get; set; } = "";
    public string Sender { get; set; } = "";
    public string Receiver { get; set; } = "";
    public string CurrentLocation { get; set; } = "";
    public string Status { get; set; } = "";
}

public class QuizQuestion
{
    public int Id { get; set; }
    public string Question { get; set; } = "";
    public string[] Options { get; set; } = Array.Empty<string>();
    public string CorrectAnswer { get; set; } = "";
}

public class BusPass
{
    public string PassNumber { get; set; } = "";
    public string PassengerName { get; set; } = "";
    public string PassType { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
}

public class Recipe
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Cuisine { get; set; } = "";
    public int PreparationMinutes { get; set; }
    public string[] Ingredients { get; set; } = Array.Empty<string>();
}

public class Wallet
{
    public int Id { get; set; }
    public decimal Balance { get; set; }
}

public class WalletTransaction
{
    public int WalletId { get; set; }
    public string Type { get; set; } = "";
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}

public class Seat
{
    public int Number { get; set; }
    public bool IsReserved { get; set; }
}

public class Screening
{
    public int Id { get; set; }
    public string MovieTitle { get; set; } = "";
    public string ShowTime { get; set; } = "";
    public Seat[] Seats { get; set; } = Array.Empty<Seat>();
}

public class Poll
{
    public int Id { get; set; }
    public string Question { get; set; } = "";
    public string[] Options { get; set; } = Array.Empty<string>();
    public bool IsOpen { get; set; }
    public List<PollVote> Votes { get; set; } = new();
}

public class PollVote
{
    public int PollId { get; set; }
    public string Option { get; set; } = "";
}

public class Workshop
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Speaker { get; set; } = "";
    public DateTime Date { get; set; }
}

public class WorkshopRegistration
{
    public int WorkshopId { get; set; }
    public string ParticipantName { get; set; } = "";
    public string Email { get; set; } = "";
}

public class CreateLinkRequest
{
    public string OriginalUrl { get; set; } = "";
}

public class ParkingRequest
{
    public string VehicleNumber { get; set; } = "";
}

public class CreateParcelRequest
{
    public string Sender { get; set; } = "";
    public string Receiver { get; set; } = "";
    public string CurrentLocation { get; set; } = "";
}

public class UpdateParcelStatusRequest
{
    public string Status { get; set; } = "";
}

public class QuizSubmitRequest
{
    public int QuestionId { get; set; }
    public string SelectedAnswer { get; set; } = "";
}

public class CreatePassRequest
{
    public string PassengerName { get; set; } = "";
    public string PassType { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class WalletOperationRequest
{
    public decimal Amount { get; set; }
}

public class ReserveRequest
{
    public List<int> SeatNumbers { get; set; } = new();
}

public class VoteRequest
{
    public string Option { get; set; } = "";
}

public class WorkshopRegistrationRequest
{
    public string ParticipantName { get; set; } = "";
    public string Email { get; set; } = "";
}
