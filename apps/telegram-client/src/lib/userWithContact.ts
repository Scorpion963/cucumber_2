import { UserWithContactType } from "@/providers/types/user-store-provider-types"

export function getFirstNameFromUser(user: UserWithContactType){
  return user.contactInfo?.name ?? user.name
}

export function getSecondNameFromUser(user: UserWithContactType){
  return user.contactInfo?.lastName ?? user.lastName
}