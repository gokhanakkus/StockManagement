namespace StockManagement.Api.Dtos;

public class StockMovementResponseDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string ProductCode { get; set; } = string.Empty;

    public string ProductName { get; set; } = string.Empty;

    public string MovementType { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public DateTime Date { get; set; }

    public string? Description { get; set; }
}
