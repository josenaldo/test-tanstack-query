import {ListQuery, type QueryInput} from "@/shared/query";

class UserKeysFactory {
  static all() {
    return ['users'] as const
  }

  static byId(id: string) {
    return [...UserKeysFactory.all(), id] as const
  }

  static list(params: QueryInput) {
    const queryParams = ListQuery.with(
        params.page,
        params.perPage,
        params.sortField,
        params.sortDirection,
        params.term
    )
    return [...UserKeysFactory.all(), { ...queryParams.toJSON() }] as const
  }
}

export {UserKeysFactory}