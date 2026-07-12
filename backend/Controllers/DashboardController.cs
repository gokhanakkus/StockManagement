using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Data;
using StockManagement.Api.Dtos;

namespace StockManagement.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context) {_context = context;}


    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var totalProducts = await _context.Products.CountAsync();

        // Boş tabloda SQL SUM, NULL döner; non-nullable decimal'e cast patlamaması için nullable'a çevirip ?? 0 uyguluyoruz.
        var totalStockValue = await _context.Products.SumAsync(p => (decimal?)(p.StockQuantity * p.UnitPrice)) ?? 0m;

        var criticalCount = await _context.Products.CountAsync(p => p.StockQuantity <= p.CriticalLevel);

        var categoryDistribution = await _context.Products.GroupBy(p => p.Category).Select(g => new CategoryDistributionDto


            {

                Category = g.Key ?? "Kategorisiz",
                Count = g.Count()

            }).ToListAsync();


        var recentMovements = await _context.StockMovements
            .AsNoTracking()
            .OrderByDescending(m => m.Date)
            .Take(5) //son 5 hareket
            .Select(m => new RecentMovementDto

            {
                Date = m.Date,
                ProductName = m.Product!.ProductName,
                MovementType = m.MovementType,
                Quantity = m.Quantity
            })
            .ToListAsync();


        var summary = new DashboardSummaryDto
        {
            TotalProducts = totalProducts,
            TotalStockValue = totalStockValue,
            CriticalCount = criticalCount,
            CategoryDistribution = categoryDistribution,
            RecentMovements = recentMovements
        };

        return Ok(summary);
    }
}
