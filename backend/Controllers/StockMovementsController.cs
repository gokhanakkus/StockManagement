using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Data;
using StockManagement.Api.Dtos;
using StockManagement.Api.Models;

namespace StockManagement.Api.Controllers;

[ApiController]
[Route("api/stockmovements")]
[Authorize]
public class StockMovementsController : ControllerBase
{
    private readonly AppDbContext _context;

    private const string MovementIn = "In";
    private const string MovementOut = "Out";

    public StockMovementsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StockMovementResponseDto>>> GetMovements()
    {
        var movements = await _context.StockMovements
            .AsNoTracking()
            .Include(m => m.Product)
            .OrderByDescending(m => m.Date)
            .ToListAsync();

        return Ok(movements.Select(MapToResponse));
    }

    [HttpGet("product/{id:int}")]
    public async Task<ActionResult<IEnumerable<StockMovementResponseDto>>> GetMovementsByProduct(int id)
    {
        var movements = await _context.StockMovements
            .AsNoTracking()
            .Include(m => m.Product)
            .Where(m => m.ProductId == id)
            .OrderByDescending(m => m.Date)
            .ToListAsync();

        return Ok(movements.Select(MapToResponse));
    }

    [HttpPost]
    public async Task<ActionResult<StockMovementResponseDto>> CreateMovement(StockMovementCreateDto dto)

    {
        if (dto.Quantity <= 0)
            return BadRequest("Miktar pozitif bir değer olmalıdır.");

        if (dto.MovementType != MovementIn && dto.MovementType != MovementOut)
            return BadRequest("Hareket tipi sadece 'In' veya 'Out' olabilir.");

        // Optimistic concurrency: iki eşzamanlı hareket aynı ürünü güncellerse RowVersion
        // uyuşmazlığı SaveChanges'te DbUpdateConcurrencyException fırlatır. Bu durumda ürünü
        // taze RowVersion ile yeniden okuyup işlemi tekrar uygularız (lost update önlenir).
        const int maxRetries = 3;

        for (var attempt = 1; ; attempt++)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == dto.ProductId);
            if (product == null)
                return NotFound($"Id={dto.ProductId} olan ürün bulunamadı.");

            // Stok Güncelleme
            if (dto.MovementType == MovementIn)
            {
                product.StockQuantity += dto.Quantity;
            }
            else
            {
                if (product.StockQuantity < dto.Quantity)
                    return BadRequest("Yetersiz stok miktarı.");

                product.StockQuantity -= dto.Quantity;
            }

            var movement = new StockMovement
            {
                ProductId = dto.ProductId,
                MovementType = dto.MovementType,
                Quantity = dto.Quantity,
                Description = dto.Description,
                Date = DateTime.UtcNow
            };

            _context.StockMovements.Add(movement);

            try
            {
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMovementsByProduct),
                    new { id = dto.ProductId }, MapToResponse(movement));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (attempt >= maxRetries)
                    return Conflict("Stok aynı anda başka bir işlem tarafından güncellendi. Lütfen tekrar deneyin.");

                // Takip edilen bayat entity'leri bırak; sonraki denemede taze veriyle tekrar oku.
                foreach (var entry in _context.ChangeTracker.Entries().ToList())
                    entry.State = EntityState.Detached;
            }
        }
    }


    private static StockMovementResponseDto MapToResponse(StockMovement m) => new()
    {
        Id = m.Id,
        ProductId = m.ProductId,
        ProductCode = m.Product?.ProductCode ?? string.Empty,
        ProductName = m.Product?.ProductName ?? string.Empty,
        MovementType = m.MovementType,
        Quantity = m.Quantity,
        Date = m.Date,
        Description = m.Description
    };
}