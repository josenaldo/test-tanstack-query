
import './App.css'
import {useGetUser} from "@/features/user/service";
import {UserCard} from "@/features/user/components/UserCard/UserCard.tsx";

function App() {
  const {
    data: user,
      isPending,
      isError,
      error,
  } = useGetUser('1')

  if(isPending) return (
    <div>Loading...</div>
  )

  if(isError) {
    return (
      <div>Error: {JSON.stringify(error)}</div>
    )
  }

  return (
    <UserCard user={user} />
  )
}

export default App
