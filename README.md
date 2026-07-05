# Stock Management
 
.NET ve React ile geliştirilmiş örnek stok yönetim uygulaması. Ürün yönetimi, stok hareketleri, basic dashboard, hareket geçmişi, Excel export ve JWT kimlik doğrulama içerir.
 
## Teknolojiler
**Backend**
- .NET Web API (.NET 10)
- Entity Framework Core (code-first)
- SQL Server
- JWT Bearer Authentication
- BCrypt (şifre hash)
- ClosedXML (Excel export)
- Swagger / OpenAPI

**Frontend**
- React (Vite)
- React Bootstrap
 
### Kurulum ve Gereksinimler
 
- .NET SDK 10
- Node.js
- SQL Server (Express veya üzeri)

İlk çalıştırmada varsayılan bir yönetici kullanıcı otomatik oluşturulur:
 
- **Kullanıcı adı:** `admin`
- **Şifre:** `admin123`

Backend `https://localhost:7182` adresinde çalışır. Swagger arayüzü: `https://localhost:7182/swagger`
Frontend `https://localhost:5173` adresinde çalışır.
  
### 1. Veritabanı Yapılandırması
 
`backend/appsettings.Example.json` dosyasını `backend/appsettings.json` olarak kopyalayın ve kendi bilgilerinizle doldurun:
 
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=<sunucu>;Database=<veritabani>;User Id=<kullanici>;Password=<sifre>;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "<en-az-32-karakterlik-guclu-bir-anahtar>",
    "Issuer": "StockManagement.Api",
    "Audience": "StockManagement.Client"
  }
}
```
 
> **Not:** `appsettings.json` bilgi içerdiği için sürüm kontrolüne dahil edilmedi.
 
### 2. Backend'i Çalıştırma
 
```bash
cd backend
dotnet restore
dotnet ef database update 
dotnet run
```

> Backend'in HTTPS sertifikası izni için gerekirse: `dotnet dev-certs https --trust`
 
### 3. Frontend'i Çalıştırma
 
```bash
cd frontend
npm install
npm run dev
```
 
