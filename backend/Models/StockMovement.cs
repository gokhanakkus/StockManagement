using System.ComponentModel.DataAnnotations;

namespace StockManagement.Api.Models;

public class StockMovement
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    [Required]
    public string MovementType { get; set; } = string.Empty;

    [Required]
    public int Quantity { get; set; }

    public DateTime Date { get; set; } = DateTime.Now;

    public string? Description { get; set; }

    public Product? Product { get; set; }
}
