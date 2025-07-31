import type {User} from "@/features/user/model/User.ts";
import type { JSX } from "react";

interface UserCardProps {
  user: User;
}

function UserCard({user}: UserCardProps): JSX.Element {

  return (
    <div>
      <h1>User Card</h1>
      {user.name}
      {user.email}
      {user.username}
    </div>
  )
}

export {UserCard};