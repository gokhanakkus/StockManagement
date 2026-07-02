using System.ComponentModel.DataAnnotations;

namespace StockManagement.Api.Models;

// Stok hareketi (giriş/çıkış) varlığı
public class StockMovement
{
    // Birincil anahtar (identity)
    public int Id { get; set; }

    // İlişkili ürünün yabancı anahtarı
    public int ProductId { get; set; }

    // Hareket tipi ("In" veya "Out")
    [Required]
    public string MovementType { get; set; } = string.Empty;

    // Miktar (zorunlu)
    [Required]
    public int Quantity { get; set; }

    // Hareket tarihi (varsayılan: şimdi)
    public DateTime Date { get; set; } = DateTime.Now;

    // Açıklama (opsiyonel)
    public string? Description { get; set; }

    // Navigasyon özelliği: ilgili ürün
    public Product? Product { get; set; }
}
