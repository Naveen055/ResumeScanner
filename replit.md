# ATS Resume Analyzer

## Overview

This is a frontend-only web application for analyzing resumes against Applicant Tracking Systems (ATS). The application provides client-side resume analysis with modern design, dark mode support, and full responsiveness. Users can upload PDF or DOCX resumes, select target job roles, and receive detailed ATS scoring, keyword analysis, and improvement suggestions.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

✓ **Enhanced Design System**: Complete visual overhaul with modern gradients, improved spacing, and enhanced animations
✓ **Dark Mode Implementation**: Full dark mode support with theme toggle and proper color schemes
✓ **Responsive Design**: Mobile-first approach with breakpoint optimizations for all screen sizes
✓ **PDF Parsing Fix**: Improved PDF text extraction with better error handling and formatting
✓ **Component Enhancements**: All components redesigned with hover effects, better visual hierarchy, and accessibility
✓ **Performance Optimizations**: Enhanced animations, better loading states, and smoother transitions

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components and custom design system
- **State Management**: React hooks for local state management
- **Build Tool**: Vite for development and building
- **UI Library**: Comprehensive component library using Radix UI primitives
- **Theme System**: Custom dark/light mode implementation with system preference detection
- **File Processing**: 100% client-side PDF and DOCX parsing with no server dependency

### Design System
- **Color Scheme**: Custom HSL-based color system with full dark mode support
- **Typography**: Modern font scales with responsive sizing
- **Animations**: Smooth transitions, hover effects, and micro-interactions
- **Responsive Design**: Mobile-first approach with breakpoint optimizations
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Client-Side Processing
- **PDF Parsing**: pdfjs-dist library with CDN worker for text extraction
- **DOCX Parsing**: mammoth library for Word document processing
- **File Validation**: Type and size validation before processing
- **Privacy-First**: All processing happens locally in the browser
- **No Data Collection**: Zero data sent to servers or external services

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