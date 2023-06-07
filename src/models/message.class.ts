export class Message {
    messageId: string = '';
    userId: string = '';
    userName: string = '';
    message: string = '';
    date: Date = new Date();
    attachedImage: string | null = null;
    attachedFile: string | null = null;
    link: string | null = null;

    constructor(messageId: string, userId: string, userName: string, message: string, date: Date, attachedImage: string | null, attachedFile: string | null, link: string | null) {
        this.messageId = messageId;
        this.userId = userId;
        this.userName = userName;
        this.message = message;
        this.date = date;
        this.attachedImage = attachedImage;
        this.attachedFile = attachedFile;
        this.link = link;
    }
}