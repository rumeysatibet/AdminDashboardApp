# Frontend - React TypeScript Dashboard

Bu proje, JSONPlaceholder API'sini kullanarak kullanıcı ve gönderi yönetimi yapan profesyonel bir React TypeScript uygulamasıdır.

## Özellikler

- **Dashboard**: İstatistikler, son kullanıcılar ve gönderiler
- **Kullanıcı Yönetimi**: Tam CRUD işlemleri (Oluştur, Oku, Güncelle, Sil)
- **Gönderi Yönetimi**: Tam CRUD işlemleri ve kullanıcı ilişkilendirmesi
- **Responsive Tasarım**: Tüm cihazlarda uyumlu arayüz
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Toast Bildirimleri**: Kullanıcı geri bildirimleri
- **Form Validasyonu**: Kapsamlı form doğrulama

## Teknolojiler

- **React 19.1.1** - UI Framework
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool
- **Tailwind CSS v3** - Styling
- **React Router DOM** - Routing
- **Lucide React** - İkonlar
- **ESLint** - Kod kalitesi

## Proje Yapısı

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Genel bileşenler (Button, Modal, etc.)
│   │   ├── forms/           # Form bileşenleri (Input, Select, etc.)
│   │   ├── layout/          # Layout bileşenleri
│   │   └── lists/           # Liste bileşenleri (DataTable)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Sayfa bileşenleri
│   ├── services/            # API servisleri
│   ├── styles/              # Stil dosyaları
│   └── types/               # TypeScript tip tanımları
├── public/
└── dist/
```

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Kurulum

```bash
# Proje klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

### Build

```bash
# Production build
npm run build

# Build'i önizleme
npm run preview
```

### Kod Kalitesi

```bash
# ESLint kontrolü
npm run lint

# ESLint otomatik düzeltme
npm run lint:fix
```

## 📱 Sayfalar

### Dashboard (`/`)
- Sistem istatistikleri
- Son eklenen kullanıcılar (5 adet)
- Son gönderiler (5 adet)
- Hızlı kullanıcı ekleme
- Rapor indirme

### Kullanıcı Yönetimi (`/users`)
- Kullanıcı listesi (ID, Ad, Kullanıcı Adı, E-posta)
- Yeni kullanıcı ekleme
- Kullanıcı düzenleme
- Kullanıcı silme
- Kullanıcı detay görüntüleme

### Gönderi Yönetimi (`/posts`)
- Gönderi listesi (ID, Başlık, Yazar)
- Yeni gönderi ekleme
- Gönderi düzenleme
- Gönderi silme
- Gönderi detay görüntüleme
- Yazar bilgisi gösterimi

## 🔧 API Entegrasyonu

JSONPlaceholder API endpoints:
- **Users**: `https://jsonplaceholder.typicode.com/users`
- **Posts**: `https://jsonplaceholder.typicode.com/posts`

### API Servisleri

- `UserService`: Kullanıcı CRUD işlemleri
- `PostService`: Gönderi CRUD işlemleri

## 🎨 UI/UX Özellikleri

- **Responsive Design**: Mobile-first yaklaşım
- **Dark/Light Theme Ready**: Tailwind CSS color scheme
- **Loading States**: Tüm async işlemler için loading göstergeleri
- **Error Handling**: Kapsamlı hata yönetimi
- **Toast Notifications**: Başarı/hata mesajları
- **Form Validation**: Real-time form doğrulama
- **Modal Management**: Tutarlı modal deneyimi

## 🔒 Kod Kalitesi

- **TypeScript**: %100 tip güvenliği
- **ESLint**: Sıfır hata/uyarı
- **Component Isolation**: React.memo optimizasyonları
- **Custom Hooks**: Yeniden kullanılabilir logic
- **Service Layer**: API çağrıları için ayrık katman

## 📦 Bileşen Kütüphanesi

### Common Bileşenler
- `Button` - Çoklu variant desteği
- `Modal` - Responsive modal dialog
- `ConfirmationModal` - Onay dialogi
- `LoadingSpinner` - Loading göstergesi
- `Toast` - Bildirim sistemi

### Form Bileşenleri
- `Input` - Text input with validation
- `TextArea` - Multiline text input
- `Select` - Dropdown selection
- `QuickUserForm` - Optimize edilmiş kullanıcı formu

### Layout Bileşenleri
- `Header` - Uygulama başlığı
- `Sidebar` - Navigasyon menüsü
- `Layout` - Ana layout wrapper

## Deployment

Bu uygulama Netlify veya Vercel gibi platformlarda kolayca deploy edilebilir:

```bash
# Build al
npm run build

# dist/ klasörünü deploy et
```

## Geliştirme Notları

- Input focus problemleri `useId` hook kullanılarak çözüldü
- JSONPlaceholder fake API limitasyonları client-side state management ile aşıldı
- Component re-render optimizasyonları React.memo ile yapıldı
- PDF gereksinimlerine uygun olarak sadece gerekli alanlar gösteriliyor

## 🔮 Sonraki Adımlar (Phase 2)

- NestJS backend entegrasyonu
- Real database bağlantısı
- Authentication & Authorization
- Advanced filtering & pagination
- File upload functionality
- Real-time updates

---

**Proje Durumu**: Phase 1 Tamamlandı ✅  
**ESLint**: 0 error, 0 warning ✅  
**Build**: Success ✅  
**TypeScript**: Full type safety ✅
