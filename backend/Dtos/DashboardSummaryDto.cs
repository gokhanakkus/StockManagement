namespace StockManagement.Api.Dtos;

public class DashboardSummaryDto
{
    public int TotalProducts { get; set; }

    public decimal TotalStockValue { get; set; }

    public int CriticalCount { get; set; }

    public List<CategoryDistributionDto> CategoryDistribution { get; set; } = new();

    public List<RecentMovementDto> RecentMovements { get; set; } = new();
}

public class CategoryDistributionDto
{
    public string Category { get; set; } = string.Empty;

    public int Count { get; set; }
}

public class RecentMovementDto
{
    public DateTime Date { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public string MovementType { get; set; } = string.Empty;

    public int Quantity { get; set; }
}
