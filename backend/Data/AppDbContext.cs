using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Models;

namespace StockManagement.Api.Data;

// Uygulamanın veritabanı bağlamı (EF Core)
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Ürünler tablosu
    public DbSet<Product> Products => Set<Product>();

    // Stok hareketleri tablosu
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ProductCode alanı için benzersiz index
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.ProductCode)
            .IsUnique();

        // Ürün silindiğinde ilişkili stok hareketleri de silinsin
        modelBuilder.Entity<StockMovement>()
            .HasOne(m => m.Product)
            .WithMany(p => p.StockMovements)
            .HasForeignKey(m => m.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // UnitPrice için ondalık hassasiyet (18,2)
        modelBuilder.Entity<Product>()
            .Property(p => p.UnitPrice)
            .HasColumnType("decimal(18,2)");
    }
}
