import { createFileRoute } from '@tanstack/react-router'
import UsersList from '../Pages/UsersList'

export const Route = createFileRoute('/users')({
  component: UsersList
})
