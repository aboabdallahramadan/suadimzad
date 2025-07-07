import { AdComment } from "./adComment"
import { AdDetails } from "./adDetails"
import { AdUser } from "./adUser"
import { AdSmall } from "./adSmall"

export type Ad = {
  id: string
  images: string[]
  adDetails: AdDetails
  user: AdUser
  comments: AdComment[]
  similarAds: AdSmall[]
}