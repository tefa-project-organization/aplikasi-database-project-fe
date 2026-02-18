import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * AdvancedPagination Component
 * 
 * A reusable pagination component with:
 * - Jump to page input
 * - Page numbers with ellipsis for better UX
 * - Previous/Next navigation
 * - Current page highlighting
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback when page changes (receives page number)
 * @param {number} [props.siblingCount=1] - Number of sibling pages to show on each side of current page
 * @param {string} [props.className] - Additional CSS classes
 */
export default function AdvancedPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 0,
  className,
}) {
  const [jumpPage, setJumpPage] = useState("");

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5;

    // If total pages are less than threshold, show all pages
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "dots", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "dots", ...middleRange, "dots", totalPages];
    }
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      setJumpPage("");
    }
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return (
      <div className={cn("flex items-center justify-between text-sm text-muted-foreground", className)}>
        <span>Page 1 of 1</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      {/* Page info */}
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "dots") {
              return (
                <span
                  key={`dots-${index}`}
                  className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  "h-8 w-8 p-0 text-sm font-medium",
                  currentPage === page && "pointer-events-none"
                )}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Jump to page */}
      <form
        onSubmit={handleJumpToPage}
        className="flex items-center gap-2"
      >
        <span className="text-sm text-muted-foreground hidden sm:inline">Go to page</span>
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          placeholder="#"
          className="h-8 w-16 text-center"
          aria-label="Jump to page number"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={!jumpPage || parseInt(jumpPage, 10) < 1 || parseInt(jumpPage, 10) > totalPages}
          className="h-8"
        >
          Go
        </Button>
      </form>
    </div>
  );
}
