import {Pagination} from '@/shared/query/pagination'
import {SortDirection} from "@/shared/query/sort-direction.ts";

interface Range {
  start: number
  end: number
}

interface Sort {
  field: string
  direction: SortDirection
}

interface QueryInput {
  page: number
  perPage: number
  sortField: string
  sortDirection: SortDirection
  term: string
}

interface QueryResult<T> {
  items: T[]
  meta: {
    count: number
  }
}

class ListQuery {
  pagination: Pagination
  sort: Sort
  term: string

  constructor(pagination: Pagination, sort: Sort, term: string) {
    this.pagination = pagination
    this.sort = sort
    this.term = term
  }

  get queryString(): string {
    const filter = this.term ? `&filter={"term":"${this.term}"}` : ''
    const range = this.pagination.rangeQueryParam
    const sort = `["${this.sort.field}","${this.sort.direction}"]`
    return `${range}&sort=${sort}&${filter}`
  }

  static with(
      page: number,
      perPage: number,
      sortField: string,
      sortDirection: SortDirection,
      term: string
  ): ListQuery {
    const pagination = Pagination.fromPage(page, perPage)
    const sort = { field: sortField, direction: sortDirection }
    return new ListQuery(pagination, sort, term)
  }

  toJSON() {
    return {
      page: this.pagination.page,
      perPage: this.pagination.limit,
      sortField: this.sort.field,
      sortDirection: this.sort.direction,
      term: this.term,
    }
  }
}

export { ListQuery }
export type { QueryInput, QueryResult, Range, Sort }