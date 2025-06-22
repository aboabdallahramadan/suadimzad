import { ExtraInfo } from "./extraInfo"

export type AdDetails = {
    title: string
    likes: number
    category: string
    price: number
    subcategory: string
    location: string
    extraInfo: ExtraInfo[]  // extra info like gender, nationality, qualification, experience, salary, career, isDriver, jobType
    description: string
    timeAgo: string
    views: number
}