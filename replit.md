# ATS Resume Analyzer

## Overview

This is a full-stack web application for analyzing resumes against Applicant Tracking Systems (ATS). The application allows users to upload their resumes (PDF or DOCX) and select target job roles to receive detailed analysis including ATS scores, keyword matching, and improvement suggestions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and TanStack Query for server state
- **Build Tool**: Vite for development and building
- **UI Library**: Comprehensive component library using Radix UI primitives

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: In-memory storage (MemStorage class)
- **File Processing**: Client-side PDF and DOCX parsing

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured via Drizzle
- **ORM**: Drizzle ORM with schema-first approach
- **Migration Management**: Drizzle Kit for database migrations
- **Session Storage**: Currently using in-memory storage with interface for easy migration to database

## Key Components

### File Processing System
- **PDF Parser**: Uses pdfjs-dist library for client-side PDF text extraction
- **DOCX Parser**: Placeholder for Word document processing
- **File Validation**: Type and size validation for uploaded files
- **Content Extraction**: Text content extraction for analysis

### ATS Analysis Engine
- **Keyword Matching**: Configurable job role keywords with priority levels
- **Score Calculation**: Multi-factor scoring including keyword coverage and format analysis
- **Job Role Definitions**: Pre-defined job roles (Frontend, Backend, Full Stack, Data Scientist, etc.)
- **Improvement Suggestions**: Context-aware recommendations based on analysis results

### UI Components
- **File Upload**: Drag-and-drop interface with progress feedback
- **Job Role Selection**: Dropdown with pre-configured role options
- **Analysis Results**: Visual score display with circular progress indicators
- **Keyword Analysis**: Categorized display of found/missing keywords
- **Improvement Tips**: Actionable suggestions for resume enhancement

## Data Flow

1. **File Upload**: User uploads resume file (PDF/DOCX)
2. **Content Extraction**: Client-side parsing extracts text content
3. **Job Role Selection**: User selects target job role from predefined options
4. **Analysis Processing**: 
   - Keyword matching against job role requirements
   - ATS score calculation based on multiple factors
   - Generation of improvement suggestions
5. **Results Display**: Visual presentation of analysis results with interactive components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **pdfjs-dist**: PDF text extraction
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Comprehensive set of unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety and enhanced development experience
- **drizzle-kit**: Database migration and management tools

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Assets**: Static assets served from build output directory

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Development**: Hot module replacement via Vite middleware
- **Production**: Compiled Node.js server serving static frontend

### Database Management
- **Schema**: Defined in `shared/schema.ts` with Drizzle
- **Migrations**: Generated and applied via `drizzle-kit push`
- **Connection**: Uses Neon serverless PostgreSQL driver

### Development Workflow
- **Local Development**: `npm run dev` starts development server with HMR
- **Type Checking**: `npm run check` validates TypeScript across all modules
- **Database Updates**: `npm run db:push` applies schema changes
- **Production Build**: `npm run build` creates optimized production bundle