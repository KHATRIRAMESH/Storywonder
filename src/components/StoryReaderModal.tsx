'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiData } from '@/hooks/useApi';
import Image from 'next/image';

interface StoryPage {
  id: number;
  storyId: number;
  pageNumber: number;
  content: string;
  imageUrl: string | null;
  imagePrompt: string | null;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

interface Story {
  id: number;
  title: string;
  childName: string;
  childAge: number;
  theme: string;
  pageCount: number;
  status: 'generating' | 'completed' | 'failed';
  thumbnailUrl: string | null;
}

interface StoryReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story;
}

export default function StoryReaderModal({ isOpen, onClose, story }: StoryReaderModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Fetch story pages
  const { data: pages, loading: pagesLoading, error: pagesError } = useApiData<StoryPage[]>(
    isOpen ? `/api/stories/${story.id}/pages` : ''
  );

  // Reset to first page when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sortedPages = pages ? [...pages].sort((a, b) => a.pageNumber - b.pageNumber) : [];
  const currentPageData = sortedPages[currentPage];
  const totalPages = sortedPages.length;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{story.title}</h2>
              <p className="text-sm text-gray-600">
                A story for {story.childName}, {story.childAge} years old
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {pagesLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading story pages...</p>
              </div>
            </div>
          ) : pagesError ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-red-600 mb-4">Failed to load story pages</p>
                <p className="text-sm text-gray-500">{pagesError}</p>
              </div>
            </div>
          ) : totalPages === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No pages available</p>
                <p className="text-sm text-gray-500">This story is still being generated</p>
              </div>
            </div>
          ) : (
            <div className="h-[calc(90vh-180px)] flex">
              {/* Left side - Image */}
              <div className="w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
                {currentPageData?.imageUrl ? (
                  <div className="relative w-full h-full max-w-md">
                    <Image
                      src={currentPageData.imageUrl}
                      alt={`Page ${currentPageData.pageNumber} illustration`}
                      fill
                      className="object-contain rounded-xl shadow-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {currentPageData.status === 'generating' && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                        <div className="text-center text-white">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p className="text-sm">Generating image...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full max-w-md bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {currentPageData?.status === 'generating' ? (
                      <div className="text-center text-gray-500">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                        <p>Creating illustration...</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-4" />
                        <p>No illustration available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right side - Content */}
              <div className="w-1/2 p-8 flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <div className="prose prose-lg max-w-none">
                    {currentPageData ? (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-500 mb-4">
                          Page {currentPageData.pageNumber} of {story.pageCount}
                        </div>
                        <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                          {currentPageData.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <p>Page content not available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Page Navigation */}
                <div className="mt-6 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 0}
                      className="flex items-center space-x-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>

                    {/* Page dots */}
                    <div className="flex space-x-2">
                      {sortedPages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToPage(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentPage
                              ? 'bg-blue-600'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to page ${index + 1}`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages - 1}
                      className="flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-center mt-4 text-sm text-gray-500">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
