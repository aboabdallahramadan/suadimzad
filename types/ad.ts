import { AdComment } from "./adComment"
import { AdDetails } from "./adDetails"
import { AdUser } from "./adUser"

export type Ad = {
  id: string
  images: string[]
  adDetails: AdDetails
  user: AdUser
  comments: AdComment[]
}