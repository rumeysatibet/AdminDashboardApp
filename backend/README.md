# Backend - NestJS API Server

Bu proje, kullanıcı ve gönderi yönetimi için geliştirilmiş profesyonel bir NestJS API sunucusudur.

## Özellikler

- **REST API**: Tam RESTful API architecture
- **User Management**: Kullanıcı CRUD işlemleri
- **Post Management**: Gönderi CRUD işlemleri
- **Validation**: Class-validator ile input validation
- **Error Handling**: Global exception filter
- **Logging**: Request/response interceptor
- **Swagger Documentation**: API dokümantasyonu
- **TypeScript**: Güçlü tip sistemi

## Teknolojiler

- **NestJS** - Node.js framework
- **TypeScript** - Programming language
- **Class Validator** - Input validation
- **Swagger** - API documentation
- **Class Transformer** - Object transformation

## Gereksinimler

- Node.js 18+
- npm veya yarn

## Kurulum

```bash
# Dependencies'leri yükle
npm install

# Development server'ı başlat
npm run start:dev

# Production build
npm run build

# Production'da çalıştır
npm run start:prod
```

## Kullanım

Server başladıktan sonra aşağıdaki endpointler kullanılabilir:

### API Base URL
```
http://localhost:3002/api
```

### Endpoints

#### Users
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/:id` - Kullanıcı detayını getir
- `POST /api/users` - Yeni kullanıcı oluştur
- `PATCH /api/users/:id` - Kullanıcı güncelle
- `DELETE /api/users/:id` - Kullanıcı sil

#### Posts
- `GET /api/posts` - Tüm gönderileri listele
- `GET /api/posts/:id` - Gönderi detayını getir
- `POST /api/posts` - Yeni gönderi oluştur
- `PATCH /api/posts/:id` - Gönderi güncelle
- `DELETE /api/posts/:id` - Gönderi sil

## API Dokümantasyonu

Swagger UI dokümantasyonuna şu adresten erişebilirsiniz:
```
http://localhost:3002/api/docs
```

## Test

```bash
# Unit testler
npm run test

# E2E testler
npm run test:e2e

# Test coverage
npm run test:cov
```

## Proje Yapısı

```
backend/
├── src/
│   ├── users/          # User module
│   ├── posts/          # Post module
│   ├── common/         # Common utilities
│   ├── app.module.ts   # Main app module
│   └── main.ts         # Application entry point
├── test/               # Test files
└── package.json
```

## Konfigürasyon

### Environment Variables
- `PORT`: Server port (default: 3002)

### CORS
CORS frontend için otomatik olarak yapılandırılmıştır:
- Origin: `http://localhost:5173`

## Geliştirme

1. Repository'yi klonla
2. Dependencies'leri yükle: `npm install`
3. Development server'ı başlat: `npm run start:dev`
4. Browser'da API'ye erişim: `http://localhost:3002/api`

## Not

Bu API server test amaçlı geliştirilmiştir ve gerçek bir veritabanı kullanmamaktadır. Tüm veriler memory'de tutulur ve server yeniden başlatıldığında kaybolur.