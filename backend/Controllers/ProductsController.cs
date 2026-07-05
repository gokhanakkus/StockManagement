using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Data;
using StockManagement.Api.Dtos;
using StockManagement.Api.Models;

namespace StockManagement.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context){_context = context;}

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts()
    {
        // EF statik. SQL e çeviremediği için önce entity leri DTOya maple
        var products = await _context.Products.AsNoTracking().ToListAsync();

        return Ok(products.Select(MapToResponse));
    }


    [HttpGet("critical")]
    public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetCriticalProducts()

    {
        var products = await _context.Products
            .AsNoTracking()
            .Where(p => p.StockQuantity <= p.CriticalLevel)
            .ToListAsync();

        return Ok(products.Select(MapToResponse));
    }


    [HttpGet("export")]
    public async Task<IActionResult> ExportProducts()
    {
        var products = await _context.Products.AsNoTracking().ToListAsync();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Ürünler");

        var headers = new[]
        {
            "Ürün Kodu", "Ürün Adı", "Kategori", "Birim",
            "Birim Fiyat", "Stok Miktarı", "Kritik Seviye"
        };

        for (var column = 0; column < headers.Length; column++)
        {
            worksheet.Cell(1, column + 1).Value = headers[column];
        }

        var headerRow = worksheet.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.LightGray;

        var rowIndex = 2;
        foreach (var product in products)
        {
            worksheet.Cell(rowIndex, 1).Value = product.ProductCode;
            worksheet.Cell(rowIndex, 2).Value = product.ProductName;
            worksheet.Cell(rowIndex, 3).Value = product.Category;
            worksheet.Cell(rowIndex, 4).Value = product.Unit;
            worksheet.Cell(rowIndex, 5).Value = product.UnitPrice;
            worksheet.Cell(rowIndex, 6).Value = product.StockQuantity;
            worksheet.Cell(rowIndex, 7).Value = product.CriticalLevel;
            rowIndex++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        var fileName = $"Urunler_{DateTime.Now:yyyyMMdd}.xlsx";

        const string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        return File(stream.ToArray(), contentType, fileName);
    }


    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)

    {
        var product = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) return NotFound($"Id={id} olan ürün bulunamadı.");

        return Ok(MapToResponse(product));
    }


    [HttpPost]
    public async Task<ActionResult<ProductResponseDto>> CreateProduct(ProductCreateDto dto)
    {
        // unique kontrol
        var codeExists = await _context.Products.AnyAsync(p => p.ProductCode == dto.ProductCode);

        if (codeExists) return BadRequest($"'{dto.ProductCode}' ürün kodu zaten kullanılıyor.");

        var product = new Product

        {
            ProductCode = dto.ProductCode,
            ProductName = dto.ProductName,
            Category = dto.Category,
            Unit = dto.Unit,

            UnitPrice = dto.UnitPrice,
            StockQuantity = dto.StockQuantity,
            CriticalLevel = dto.CriticalLevel,
            CreatedAt = DateTime.Now

        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, MapToResponse(product));
    }


    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductResponseDto>> UpdateProduct(int id, ProductUpdateDto dto)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) return NotFound($"Id={id} olan ürün bulunamadı.");

        // productCode unique
        product.ProductName = dto.ProductName;
        product.Category = dto.Category;
        product.Unit = dto.Unit;
        product.UnitPrice = dto.UnitPrice;
        product.CriticalLevel = dto.CriticalLevel;

        await _context.SaveChangesAsync();

        return Ok(MapToResponse(product));
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

        if (product is null)
            return NotFound($"Id={id} olan ürün bulunamadı.");

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    private static ProductResponseDto MapToResponse(Product p) => new()
    {
        Id = p.Id,
        ProductCode = p.ProductCode,
        ProductName = p.ProductName,
        Category = p.Category,
        Unit = p.Unit,
        UnitPrice = p.UnitPrice,
        StockQuantity = p.StockQuantity,
        CriticalLevel = p.CriticalLevel,
        CreatedAt = p.CreatedAt,
        IsCritical = p.StockQuantity <= p.CriticalLevel
    };
}
