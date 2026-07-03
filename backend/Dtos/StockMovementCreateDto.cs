using System.ComponentModel.DataAnnotations;

namespace StockManagement.Api.Dtos;

public class StockMovementCreateDto
{
    [Required(ErrorMessage = "Ürün Id zorunludur.")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Hareket tipi zorunludur.")]
    public string MovementType { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Miktar pozitif olmalıdır.")]
    public int Quantity { get; set; }

    public string? Description { get; set; }
}
