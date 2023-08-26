export interface INotification {
    message: string,
    type: NotificationType,
    duration: number
}

export enum NotificationType {
    Baja = 0,
    Media = 1,
    Alta = 2
}