# Urban Style Try-On

A React-based virtual try-on application for urban fashion, allowing users to visualize clothing items in real-time.

## 🚀 Features

- **Virtual Try-On**: Upload images and try on different urban fashion items
- **Real-time Visualization**: See clothing items rendered on your image
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Type Safety**: Full TypeScript support for better development experience
- **Fast Performance**: Built with Vite for optimal build times and HMR
- **Docker Support**: Containerized development and production environments

## 🛠️ Tech Stack

- **React 18** - Frontend library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Supabase** - Backend services
- **Docker** - Containerization

## 📦 Prerequisites

### Local Development
- Node.js 18.0 or higher
- npm 9.0 or higher

### Docker Development
- Docker 20.10 or higher
- Docker Compose 2.0 or higher

## 🐳 Docker Setup

### Development with Docker

1. **Build and run the development container**
   ```bash
   docker-compose up --build
   ```
   This will:
   - Install all dependencies
   - Start the Vite development server
   - Mount your local source code for live reload
   - Make the app available at `http://localhost:5173`

2. **Run in detached mode (background)**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the container**
   ```bash
   docker-compose down
   ```

### Production Build with Docker

1. **Build the production Docker image**
   ```bash
   docker build -t urban-style-try-on:latest .
   ```

2. **Run the production container**
   ```bash
   docker run -p 4173:4173 \
     -e VITE_SUPABASE_URL=your_supabase_url \
     -e VITE_SUPABASE_ANON_KEY=your_supabase_anon_key \
     urban-style-try-on:latest
   ```

3. **Using Docker Compose for production**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

### Docker Commands Reference

| Command | Description |
|---------|-------------|
| `docker-compose up --build` | Build and start dev container |
| `docker-compose up -d` | Start in detached mode |
| `docker-compose down` | Stop and remove containers |
| `docker-compose logs -f` | Follow logs |
| `docker-compose exec app bash` | Access container shell |
| `docker-compose restart` | Restart services |
| `docker-compose ps` | Check running services |

## 🔧 Installation (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/urban-style-try-on.git
   cd urban-style-try-on
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your Supabase credentials.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
urban-style-try-on/
├── public/          # Static assets
├── src/            # Source code
│   ├── components/ # React components
│   ├── lib/        # Utilities and helpers
│   ├── pages/      # Page components
│   ├── styles/     # Global styles
│   └── types/      # TypeScript definitions
├── supabase/       # Supabase configurations
├── docker/         # Docker configurations
├── Dockerfile      # Production Dockerfile
├── Dockerfile.dev  # Development Dockerfile
├── docker-compose.yml      # Development compose file
├── docker-compose.prod.yml # Production compose file
└── nginx.conf      # Nginx configuration for production
```

## 🐳 Docker Configuration Files

### Dockerfile (Production)
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile.dev (Development)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### docker-compose.yml (Development)
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    stdin_open: true
    tty: true
```

### docker-compose.prod.yml (Production)
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "4173:80"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

## 🚀 Available Scripts

### Local Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Docker Development
- `docker-compose up --build` - Start development with Docker
- `docker-compose exec app npm run <script>` - Run npm scripts in container

## 🏗️ Building for Production

### Local Build
```bash
npm run build
```

### Docker Production Build
```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up --build

# Or using Docker directly
docker build -t urban-style-try-on:prod .
docker run -p 4173:80 urban-style-try-on:prod
```

The production build will be available at `http://localhost:4173`

## 🧪 Testing with Docker

```bash
# Run tests in Docker container
docker-compose exec app npm test

# Run tests in watch mode
docker-compose exec app npm run test:watch

# Run tests with coverage
docker-compose exec app npm run test:coverage
```

## 📝 Environment Variables

### For Docker
Create a `.env` file in the project root (Docker Compose will automatically use this):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For Local Development
Create a `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔗 API Integration

This project uses Supabase for:
- User authentication
- Database operations
- File storage
- Real-time subscriptions

## 🐳 Docker Tips & Best Practices

### Development Workflow
1. Start development: `docker-compose up --build`
2. Make code changes - they auto-refresh in the container
3. View logs: `docker-compose logs -f app`
4. Access container shell: `docker-compose exec app sh`
5. Stop: `docker-compose down`

### Production Deployment
1. Build image: `docker build -t your-registry/urban-style-try-on:latest .`
2. Push to registry: `docker push your-registry/urban-style-try-on:latest`
3. Deploy: `docker-compose -f docker-compose.prod.yml up -d`

### Clean Up Docker Resources
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contributing with Docker
```bash
# Set up development environment
docker-compose up --build

# Run tests
docker-compose exec app npm test

# Run linting
docker-compose exec app npm run lint
```

## 🆘 Support

For support, email lagend452@gmail.com or open an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Supabase](https://supabase.com/) for backend services
- [Docker](https://docker.com/) for containerization

---

### Quick Start with Docker

For the fastest setup, simply run:
```bash
# Clone the repository
git clone https://github.com/yourusername/urban-style-try-on.git
cd urban-style-try-on

# Create .env file with your Supabase credentials
cp .env.example .env
# Edit .env with your actual credentials

# Start with Docker
docker-compose up --build
```

Visit `http://localhost:5173` to see your app running! 🎉
