# AfiEl Pharma - Online Pharmacy Platform

A modern, HIPAA-compliant online pharmacy platform built with Next.js, NestJS, and PostgreSQL.

## 🌟 Features

- **User Management**: Patient, Doctor, Pharmacist, and Admin roles
- **Product Catalog**: Browse and search medications
- **Shopping Cart**: Add products and checkout
- **Prescription Management**: Upload and verify prescriptions
- **Order Tracking**: Track order status from placement to delivery
- **Admin Panel**: Manage products, users, and orders
- **Image Upload**: Product images with automatic compression
- **Modern UI**: Toast notifications, loading skeletons, responsive design
- **Security**: HIPAA-compliant, encrypted data, audit logging

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Redis** - Caching
- **TypeORM** - ORM

### Infrastructure
- **Docker** - Containerization
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Supabase** - Database hosting

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/afiel-pharma.git
cd afiel-pharma
```

2. **Start infrastructure**
```bash
cd infrastructure
docker-compose up -d
```

3. **Setup backend**
```bash
cd backend/api
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. **Setup frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Default Admin Credentials
- Email: `admin@afielpharma.com`
- Password: `Admin@AfiEl2024!`

## 🌐 Deployment

This project is configured for free deployment on:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase
- **Redis**: Upstash

See `QUICK_START_DEPLOYMENT.md` for detailed deployment instructions.

## 📚 Documentation

- [Quick Start Deployment](QUICK_START_DEPLOYMENT.md) - Deploy in 30 minutes
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Detailed deployment guide
- [Free Deployment Guide](FREE_DEPLOYMENT_GUIDE.md) - All free hosting options
- [Database Access Guide](DATABASE_ACCESS_GUIDE.md) - How to access your database
- [Architecture](ARCHITECTURE.md) - System architecture overview

## 🔒 Security Features

- HIPAA-compliant data handling
- End-to-end encryption for sensitive data
- Secure authentication with JWT
- Role-based access control (RBAC)
- Audit logging for all actions
- SSL/TLS encryption
- Input validation and sanitization

## 🎨 UI Features

- Modern, responsive design
- Toast notifications
- Loading skeletons
- Image compression
- Dark mode support
- Mobile-friendly

## 📊 Database Schema

- **users** - User accounts and profiles
- **products** - Medication catalog
- **orders** - Customer orders
- **audit_logs** - System audit trail

## 🛠️ Development

### Run tests
```bash
npm test
```

### Build for production
```bash
npm run build
```

### Lint code
```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the AfiEl Pharma team

## 📞 Support

For support, email support@afiel-pharma.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NestJS team for the backend framework
- All open-source contributors

---

**Note**: This is a demonstration project. For production use, ensure proper HIPAA compliance, security audits, and legal requirements are met.
