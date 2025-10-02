# 📚 OpenLibrary Search Application

<img width="1041" height="575" alt="image" src="https://github.com/user-attachments/assets/67e8a434-114e-4280-9a62-b1970af4183e" />


A modern, responsive web application built with Next.js that provides an intuitive interface for searching and exploring books using the OpenLibrary API.

## 🚀 Features

- **Advanced Search Capabilities**
  - Search by title, author, or general terms
  - Real-time search results with efficient caching
  - Author-specific search mode

- **Rich Book Details**
  - Comprehensive book information display
  - Cover image integration
  - Author biographies
  - Publication details
  - Subject categorization

- **Modern UI/UX**
  - Responsive grid layout
  - Dark mode support
  - Loading states and error handling
  - Accessible design

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Type Safety**: TypeScript
- **Font Optimization**: Next/Font with Geist

## 📦 Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

The application uses several key configurations:

- `next.config.ts` - Next.js configuration
- `components.json` - UI component settings
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind

## 📁 Project Structure

## 🌟 Key Features Implementation

### Search Functionality
- Implements real-time search using React Query
- Efficient caching and request deduplication
- Type-safe API integration

### Book Details Page
- Dynamic routing with Next.js
- Comprehensive book information display
- Author details integration
- Responsive layout design

### Performance Optimizations
- Image optimization with Next/Image
- Lazy loading implementation
- Server-side rendering where appropriate
- Efficient state management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenLibrary API](https://openlibrary.org/developers/api) for providing the book data
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
