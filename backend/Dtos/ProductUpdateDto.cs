using System.ComponentModel.DataAnnotations;

namespace StockManagement.Api.Dtos;

public class ProductUpdateDto
{
    [Required(ErrorMessage = "Ürün adı zorunludur.")]
    [StringLength(200, ErrorMessage = "Ürün adı en fazla 200 karakter olabilir.")]
    public string ProductName { get; set; } = string.Empty;

    public string? Category { get; set; }

    public string? Unit { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Birim fiyat negatif olamaz.")]
    public decimal UnitPrice { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Kritik seviye negatif olamaz.")]
    public int CriticalLevel { get; set; }
}
