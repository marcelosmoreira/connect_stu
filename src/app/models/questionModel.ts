export interface Question{
    id: number,
    userId: number,
    title: String,
    content: Text,
    likes: number,
    tags: string,
    answersCount: number,
    createdAT: Date

}