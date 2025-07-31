import type {User} from "@/features/user/model/User.ts";
import type {JSX} from "react";
import {Card, Stack, Text, Title} from "@mantine/core";

interface UserCardProps {
  user?: User | null | undefined;
}

function UserCard({user}: UserCardProps): JSX.Element {
  console.log("user: ", user)

  if (!user) return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title>User not found</Title>
      </Card>
  )

  return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack justify="space-between">
          <Title order={1}>{user?.name}</Title>
          <Text>{user?.email}</Text>
          <Text>{user?.username}</Text>
        </Stack>
      </Card>
  )
}

export {UserCard};
