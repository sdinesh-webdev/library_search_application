"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

// Define the shape of our book data from the API
type Book = {
  key: string;          // Unique identifier for the book
  title?: string;       // Book title
  name?: string;        // Used for author searches
  author_name?: string[]; // Array of author names
  first_publish_year?: number;
  cover_i?: number;     // Cover image ID from OpenLibrary
  language?: string[];  // Array of language codes
  publisher?: string[]; // Array of publisher names
  number_of_pages_median?: number;
  isbn?: string[];     // Array of ISBN numbers
};

// Function to fetch books from OpenLibrary API
async function fetchBooks({
  queryType,
  search,
  page = 1,
}: {
  queryType: "title" | "author" | "q" | "authors";
  search: string;
  page?: number;
}) {
  if (!search) return [];
  let url = "";

  // Build the appropriate URL based on search type
  if (queryType === "authors") {
    // Search for authors specifically
    url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
      search
    )}`;
  } else {
    // Search for books by title, author, or general query
    url = `https://openlibrary.org/search.json?${queryType}=${encodeURIComponent(
      search
    )}&page=${page}`;
  }

  // Fetch data and return results, handling empty responses
  const res = await axios.get(url);
  return res.data.docs ?? res.data.entries ?? [];
}

// Individual book card component
function BookCard({ book }: { book: Book }) {
  // Get cover image URL or use placeholder
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/200x300?text=No+Cover";

  // Extract the work ID from the book key for the detail page URL
  const workId = book.key.split('/').pop();

  return (
    // Link wraps the card and navigates to detail page
    <Link href={`/book/${workId}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
        {/* Image container with fixed aspect ratio */}
        <div className="relative pt-[140%]">
          <img
            src={coverUrl}
            alt={book.title ?? "Book cover"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy" // Lazy load images for better performance
          />
        </div>
        {/* Book information section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title with 2-line clamp */}
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
            {book.title ?? book.name}
          </h3>
          {/* Author names with 1-line clamp */}
          {book.author_name && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">
              By {book.author_name.join(", ")}
            </p>
          )}
          {/* Additional details pushed to bottom of card */}
          <div className="mt-auto space-y-1 text-xs text-gray-500 dark:text-gray-400">
            {book.first_publish_year && (
              <p>First published: {book.first_publish_year}</p>
            )}
            {book.publisher && book.publisher.length > 0 && (
              <p className="line-clamp-1">Publisher: {book.publisher[0]}</p>
            )}
            {book.language && book.language.length > 0 && (
              <p className="line-clamp-1">
                Language: {book.language.map(lang => lang.toUpperCase()).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Main component for book search
export default function DataFetching() {
  // State for search input and type
  const [search, setSearch] = useState("tolkien");
  const [queryType, setQueryType] = useState<
    "title" | "author" | "q" | "authors"
  >("author");

  // Fetch books using React Query
  const { data, isLoading, isError } = useQuery<Book[]>({
    queryKey: ["books", queryType, search], // Cache key based on search params
    queryFn: () => fetchBooks({ queryType, search }),
    enabled: !!search, // Only run query if search term exists
  });

  return (
    <div className="p-6 mx-auto">
      <div className="mb-8">
        <div className="flex justify-center items-center mb-8">
          <Image
          src="/books.png"
          width={100} // Specify the intrinsic width of the image
          height={100} // Specify the intrinsic height of the image
          alt="Logo"
          priority
        />
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
           OpenLibrary Search
          </h1>
        </div>
      

        {/* Search controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search for books or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-5 font-semibold"
          />

          {/* Search type selector */}
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as any)}
            className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[200px]"
          >
            <option value="title">Search by Title</option>
            <option value="author">Search by Author</option>
            <option value="q">Search (General)</option>
            <option value="authors">Search Authors Only</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading books...</p>
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to fetch books. Please try again.</p>
        </div>
      )}

      {/* Grid of book cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data?.slice(0, 15).map((item) => (
          <BookCard key={item.key} book={item} />
        ))}
      </div>

      {/* No results state */}
      {data?.length === 0 && !isLoading && !isError && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">No books found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
