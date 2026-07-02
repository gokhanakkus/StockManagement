using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Servisleri container'a ekle
builder.Services.AddControllers();

// OpenAPI/Swagger yapılandırması
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core DbContext'i SQL Server ile kaydet
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS politikası: React frontend için tüm kaynaklara izin ver
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// HTTP istek hattını yapılandır
if (app.Environment.IsDevelopment())
{
    // Swagger arayüzünü etkinleştir
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS politikasını uygula
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
