export type AdComment = {
    id: string
    user: {
        name: string
        avatar: string
    }
    comment: string
    timeAgo: string
}