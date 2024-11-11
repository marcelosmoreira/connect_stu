export interface Question{
    id?: number,
    userId: string,
    //title: string,
    content: string,
    likes: number,
   // tags: string,
    answersCount: number,
    createdAT: Date
    username?: string; 

}