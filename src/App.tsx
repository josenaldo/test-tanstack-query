import {useGetUser} from "@/features/user/service";
import {UserCard} from "@/features/user/components/UserCard/UserCard.tsx";
import {Alert, AppShell, Loader, Stack, TextInput, Title} from "@mantine/core";
import {useState} from "react";

function App() {

  const [selectedUser, setSelectedUser] = useState<string>("")

  const {
    data: user,
      isPending,
      isError,
      error,
  } = useGetUser(selectedUser)

  return (
      <AppShell
          padding="md"
      >
        <AppShell.Main>
          <Stack gap='md'>
            <Title>Enter a user ID</Title>

            <TextInput
                label="User"
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.currentTarget.value)}
                description="Enter a user ID 1, 2 or 3 to see the user details."
                rightSection={isPending ?  <Loader size='xs'/> : null}
            />

            {
              isError && <Alert color = 'red' title = 'Error'>
              {JSON.stringify(error)}
            </Alert>
            }
            <UserCard user={user} />
          </Stack>
        </AppShell.Main>
      </AppShell>


  )
}

export default App
