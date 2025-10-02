"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

// Type definition for detailed book information
type BookDetails = {
  key: string;
  title: string;
  covers?: number[];        // Array of cover image IDs
  description?: string;     // Book description
  first_publish_date?: string;
  subjects?: string[];      // Book subjects/categories
  subject_places?: string[];
  subject_times?: string[];
  authors?: Array<{ author: { key: string } }>; // Author references
  number_of_pages?: number;
  publishers?: string[];
  publish_places?: string[];
  isbn_10?: string[];
  isbn_13?: string[];
  physical_format?: string;
  languages?: Array<{ key: string }>;
};

// Type definition for author information
type Author = {
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string;
};

export default function BookPage() {
  // Get book ID from URL parameters
  const params = useParams();
  const bookId = typeof params.id === 'string' ? params.id : '';

  // Fetch book details
  const { data: book, isLoading: bookLoading } = useQuery<BookDetails>({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const res = await axios.get(`https://openlibrary.org/works/${bookId}.json`);
      return res.data;
    },
    enabled: !!bookId, // Only fetch if we have a book ID
  });

  // Fetch author details once we have the book data
  const { data: authors, isLoading: authorsLoading } = useQuery<Author[]>({
    queryKey: ["authors", book?.authors],
    queryFn: async () => {
      if (!book?.authors) return [];
      // Fetch all authors in parallel
      const authorPromises = book.authors.map(({ author }) =>
        axios.get(`https://openlibrary.org${author.key}.json`)
      );
      const responses = await Promise.all(authorPromises);
      return responses.map(res => res.data);
    },
    enabled: !!book?.authors, // Only fetch if we have author references
  });

  // Loading state
  if (bookLoading || authorsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading book details...</p>
        </div>
      </div>
    );
  }

  // Error state - book not found
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500">Book not found</p>
          <Link href="/" className="mt-4 text-blue-500 hover:underline">
            Return to search
          </Link>
        </div>
      </div>
    );
  }

  // Get cover image URL or use placeholder
  const coverUrl = book.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
    : "https://via.placeholder.com/400x600?text=No+Cover";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:underline mb-6"
        >
          ← Back to search
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Cover image */}
          <div className="md:col-span-1">
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Right column - Book details */}
          <div className="md:col-span-2 space-y-6">
            {/* Title and authors */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>
              {authors && authors.length > 0 && (
                <div className="text-xl text-gray-600 dark:text-gray-300">
                  by {authors.map(author => author.name).join(", ")}
                </div>
              )}
            </div>

            {/* Book description */}
            {book.description && (
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {typeof book.description === 'string'
                    ? book.description
                    : (book.description as any).value || "No description available"}
                </p>
              </div>
            )}

            {/* Publishing details grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Publication date */}
              {book.first_publish_date && (
                <div>
                  <h3 className="font-semibold">First Published</h3>
                  <p>{book.first_publish_date}</p>
                </div>
              )}
              
              {/* Page count */}
              {book.number_of_pages && (
                <div>
                  <h3 className="font-semibold">Pages</h3>
                  <p>{book.number_of_pages}</p>
                </div>
              )}

              {/* Publishers */}
              {book.publishers && book.publishers.length > 0 && (
                <div>
                  <h3 className="font-semibold">Publishers</h3>
                  <p>{book.publishers.join(", ")}</p>
                </div>
              )}

              {/* Physical format */}
              {book.physical_format && (
                <div>
                  <h3 className="font-semibold">Format</h3>
                  <p>{book.physical_format}</p>
                </div>
              )}
            </div>

            {/* Subject tags */}
            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author biographies */}
            {authors?.some(author => author.bio) && (
              <div>
                <h2 className="text-xl font-semibold mb-2">About the Author(s)</h2>
                {authors.map((author, index) => (
                  author.bio && (
                    <div key={index} className="mb-4">
                      <h3 className="font-semibold mb-1">{author.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {typeof author.bio === 'string'
                          ? author.bio
                          : (author.bio as any).value || "No biography available"}
                      </p>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}