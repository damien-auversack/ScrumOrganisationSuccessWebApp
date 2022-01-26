export interface Meeting {
    id?: number,
    idSprint: number | undefined,
    schedule: Date,
    description: string,
    meetingUrl: string
}
