import { createFileRoute } from '@tanstack/react-router'
import RegistrationPage from '../Pages/RegistrationPage'

export const Route = createFileRoute('/registration')({
  component: RegistrationPage,
})
