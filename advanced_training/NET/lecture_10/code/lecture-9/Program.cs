using System.Text.Json.Serialization;
using Lecture9Api.Data;
using Lecture9Api.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(allowIntegerValues: false)));

var useLazyLoading = builder.Configuration.GetValue<bool>("Experiments:LazyLoading");

builder.Services.AddSingleton<SqlCounter>();
builder.Services.AddScoped<IGenericRepository<Lecture9Api.Models.MeterInfo>, GenericRepository<Lecture9Api.Models.MeterInfo>>();
builder.Services.AddScoped<IGenericRepository<Lecture9Api.Models.CommandLog>, GenericRepository<Lecture9Api.Models.CommandLog>>();
builder.Services.AddScoped<IMeterInfoRepository, MeterInfoRepository>();
builder.Services.AddScoped<ICommandLogRepository, CommandLogRepository>();
builder.Services.AddScoped<IMeterReadingRepository, MeterReadingRepository>();
builder.Services.AddScoped<IMeterStatisticsRepository, MeterStatisticsRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.AddInterceptors(sp.GetRequiredService<SqlCounter>());
    if (useLazyLoading)
    {
        options.UseLazyLoadingProxies();
    }
});



builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/openapi/v1.json", "v1"));
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();