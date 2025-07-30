import { ExtraInfo } from "./extraInfo"

export type AdDetails = {
    id: number
    title: string
    likes: number
    category: string
    price: number
    location: string
    extraInfo: ExtraInfo[]  // extra info like gender, nationality, qualification, experience, salary, career, isDriver, jobType
    description: string
    timeAgo: string
    numberOfFavorites: number
    isFavorite: boolean,
    numberOfViews: number
}