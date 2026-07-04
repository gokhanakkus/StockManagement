using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Data;
using StockManagement.Api.Dtos;
using StockManagement.Api.Models;

namespace StockManagement.Api.Controllers;

[ApiController]
[Route("api/stockmovements")]
public class StockMovementsController : ControllerBase
{
    private readonly AppDbContext _context;

    private const string MovementIn = "In";
    private const string MovementOut = "Out";

    public StockMovementsController(AppDbContext context){ _context = context;}

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
        var productExists = await _context.Products.AnyAsync(p => p.Id == id);

        if (!productExists) return NotFound($"Id={id} olan ürün bulunamadı.");

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
        if (dto.Quantity <= 0) return BadRequest("Miktar pozitif olmalıdır.");

        if (dto.MovementType != MovementIn && dto.MovementType != MovementOut)
            return BadRequest("Hareket tipi yalnızca 'In' veya 'Out' olabilir.");

        // Hareket ve stok TEK transaction içinde
        await using var transaction = await _context.Database.BeginTransactionAsync();

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == dto.ProductId);

        if (product is null) return NotFound($"Id={dto.ProductId} olan ürün bulunamadı.");

        if (dto.MovementType == MovementIn)
        {
            product.StockQuantity += dto.Quantity;
        }

        else
        {

            if (product.StockQuantity < dto.Quantity) return BadRequest("Yetersiz stok");

            product.StockQuantity -= dto.Quantity;

        }

        var movement = new StockMovement
        {
            ProductId = product.Id,
            MovementType = dto.MovementType,
            Quantity = dto.Quantity,
            Description = dto.Description,
            Date = DateTime.Now
        };

        _context.StockMovements.Add(movement);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        movement.Product = product;

        return CreatedAtAction(nameof(GetMovementsByProduct), new { id = product.Id }, MapToResponse(movement));
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
