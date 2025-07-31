import type {Range} from './range'

class Pagination {
  /**
   * @param start - Starting index of the range (0-based)
   * @param end - Ending index of the range (0-based, inclusive)
   * @param limit - Number of items per page
   * @param page - Current page number (1-based)
   */
  constructor(
    public start: number,
    public end: number,
    public limit: number,
    public page: number
  ) {}

  /**
   * Creates a Pagination instance from an index range.
   * If not provided, uses a default range of 0-9 (10 items).
   * 
   * @param range - Object containing start and end indices
   * @returns New Pagination instance
   * 
   * @example
   * ```ts
   * // Range from 20 to 29 (10 items)
   * const pagination = Pagination.fromRange({ start: 20, end: 29 });
   * 
   * // Default range (0-9)
   * const defaultPagination = Pagination.fromRange();
   * ```
   */
  static fromRange(range?: Range): Pagination {
    const defaultRange:Range = { start: 0, end: 9 };
    const { start: rawStart, end: rawEnd } = range || defaultRange;

    // Ensures start is non-negative
    const validStart = Math.max(0, rawStart);
    
    // Ensures end is greater than or equal to start
    const validEnd = Math.max(validStart, rawEnd);
    
    // Adjusts to 10 items if range is invalid
    const adjustedEnd = validEnd === validStart ? validStart + 9 : validEnd;
    
    const itemsPerPage = adjustedEnd - validStart + 1;
    const currentPage = Math.floor(validStart / itemsPerPage) + 1;

    return new Pagination(validStart, adjustedEnd, itemsPerPage, currentPage);
  }

  /**
   * Creates a Pagination instance from page number and items per page.
   * 
   * @param page - Page number (1-based, values less than 1 are adjusted to 1)
   * @param perPage - Number of items per page (values less than 1 are adjusted to 10)
   * @returns New Pagination instance
   * 
   * @example
   * ```typescript
   * // Page 2 with 15 items per page
   * const pagination = Pagination.fromPage(2, 15);
   * ```
   */
  static fromPage(page: number, perPage: number): Pagination {
    const validPage = Math.max(1, page);
    const itemsPerPage = Math.max(1, perPage) || 10;
    
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage - 1;

    return new Pagination(startIndex, endIndex, itemsPerPage, validPage);
  }

  /**
   * Returns the offset (starting index) for database queries
   */
  get offset(): number {
    return this.start;
  }

  /**
   * Returns the current range as a tuple [start, end]
   */
  get range(): [number, number] {
    return [this.start, this.end];
  }

  /**
   * Returns the range formatted as a query string parameter
   */
  get rangeQueryParam(): string {
    return `range={"start":${this.start},"end":${this.end}}`;
  }

  /**
   * Returns a JSON representation of the current pagination
   */
  toJSON(): {
    start: number;
    end: number;
    offset: number;
    limit: number;
    page: number;
    range: [number, number];
  } {
    return {
      start: this.start,
      end: this.end,
      offset: this.start,
      limit: this.limit,
      page: this.page,
      range: this.range,
    };
  }
}

export { Pagination };