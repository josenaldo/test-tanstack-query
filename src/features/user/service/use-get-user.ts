import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'

import { getUser } from '@/features/user/api/user-api'
import { UserKeysFactory } from '@/features/user/service/user-key-queries-factory'

function groupOptions(id: string) {
  return queryOptions({
    queryKey: UserKeysFactory.byId(id),
    queryFn: () => getUser(id),
    refetchOnWindowFocus: false,
  })
}

function useGetUser(id: string) {
  const queryClient = useQueryClient()
  const options = groupOptions(id)
  const query = useQuery(options)

  const reload = () => {
    return queryClient.invalidateQueries({
      queryKey: options.queryKey,
    })
  }

  return {
    ...query,
    reload,
  }
}

function getUserQueryKey(id: string) {
  return UserKeysFactory.byId(id)
}

export { getUserQueryKey, useGetUser }
