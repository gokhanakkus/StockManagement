using System.ComponentModel.DataAnnotations;

namespace StockManagement.Api.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    public string ProductCode { get; set; } = string.Empty;

    [Required]
    public string ProductName { get; set; } = string.Empty;

    public string? Category { get; set; }

    public string? Unit { get; set; }

    public decimal UnitPrice { get; set; }

    public int StockQuantity { get; set; } = 0;

    public int CriticalLevel { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}
