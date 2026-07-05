using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagement.Api.Auth;
using StockManagement.Api.Data;
using StockManagement.Api.Dtos;

namespace StockManagement.Api.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtTokenService _tokenService;

    public AuthController(AppDbContext context, JwtTokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))

            return Unauthorized("Kullanıcı adı veya şifre hatalı.");

        var token = _tokenService.CreateToken(user);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Username = user.Username
        });
    }
}
