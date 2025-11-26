# Required NPM Packages Installation

## Install these dependencies for the Music Recognition & Karaoke features:

```bash
cd DAM-backend

# Core dependencies
npm install form-data
npm install @nestjs/axios axios
npm install @nestjs/platform-express

# Dev dependencies (TypeScript types)
npm install --save-dev @types/multer
```

## Dependencies Explained:

- **form-data**: For building multipart/form-data to send to ACRCloud API
- **@nestjs/axios**: NestJS wrapper for Axios HTTP client
- **axios**: HTTP client for making requests to ACRCloud
- **@nestjs/platform-express**: For file upload support with Multer
- **@types/multer**: TypeScript types for Multer (file uploads)

## After Installation:

Run the development server:
```bash
npm run start:dev
```

The server should start without errors if all dependencies are installed correctly.
