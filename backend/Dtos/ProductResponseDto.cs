namespace StockManagement.Api.Dtos;

public class ProductResponseDto
{
    public int Id { get; set; }

    public string ProductCode { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    public string? Category { get; set; }

    public string? Unit { get; set; }

    public decimal UnitPrice { get; set; }

    public int StockQuantity { get; set; }

    public int CriticalLevel { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsCritical { get; set; }
}
