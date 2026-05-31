'use client';

import { Button } from '@/components/atoms/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages: (number | string)[] = [];
  const maxVisible = 3;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  if (startPage > 1) pages.push(1, '...');
  for (let i = startPage; i <= endPage; i++) pages.push(i);
  if (endPage < totalPages) pages.push('...', totalPages);

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      <Button variant="secondary" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2">
        &lt;
      </Button>
      {pages.map((p, idx) => (
        typeof p === 'number' ? (
          <Button
            key={idx}
            variant={p === currentPage ? 'primary' : 'secondary'}
            onClick={() => onPageChange(p)}
            className="px-3 py-2"
          >
            {p}
          </Button>
        ) : (
          <span key={idx} className="px-2 text-muted-foreground">…</span>
        )
      ))}
      <Button variant="secondary" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2">
        &gt;
      </Button>
    </div>
  );
}