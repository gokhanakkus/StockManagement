using System.ComponentModel.DataAnnotations;

namespace StockManagement.Api.Models;

// Ürün (stok kalemi) varlığı
public class Product
{
    // Birincil anahtar (identity)
    public int Id { get; set; }

    // Ürün kodu (zorunlu, benzersiz olmalı)
    [Required]
    public string ProductCode { get; set; } = string.Empty;

    // Ürün adı (zorunlu)
    [Required]
    public string ProductName { get; set; } = string.Empty;

    // Kategori
    public string? Category { get; set; }

    // Birim (örn. "Piece", "Kg", "Lt")
    public string? Unit { get; set; }

    // Birim fiyat
    public decimal UnitPrice { get; set; }

    // Stok miktarı (varsayılan 0)
    public int StockQuantity { get; set; } = 0;

    // Kritik stok seviyesi (varsayılan 0)
    public int CriticalLevel { get; set; } = 0;

    // Oluşturulma tarihi (varsayılan: şimdi)
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // İlişki: ürüne ait stok hareketleri
    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}
