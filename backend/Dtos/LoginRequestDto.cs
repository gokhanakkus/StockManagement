using System.ComponentModel.DataAnnotations;

namespace StockManagement.Api.Dtos;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Kullanıcı adı zorunludur.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifre zorunludur.")]
    public string Password { get; set; } = string.Empty;
}
