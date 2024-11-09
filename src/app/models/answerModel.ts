export interface Answer{
    id: number,
    questionId: number,
    userId: number,
    content: Text,
    likes: number,
    isAccepted: boolean,
    createdAT: Date
}