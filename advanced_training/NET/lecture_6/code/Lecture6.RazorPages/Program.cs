var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddHttpClient("Workshops", client =>
{
    client.BaseAddress = new Uri("http://localhost:5022");
});

var app = builder.Build();

app.MapRazorPages();
app.Run();
