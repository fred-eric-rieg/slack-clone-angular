import { Timestamp } from "@angular/fire/firestore";

export class Chat {
    chatId: string = '';
    creationDate: Timestamp = Timestamp.now();
    members: string[] = [];
    threads: string[] = [];

    constructor(obj: any) {
        this.chatId = obj && obj.channelId || '';
        this.creationDate = obj && obj.creationDate;
        this.members = obj && obj.members || [];
        this.threads = obj && obj.threads || [];
    }


    toJSON() {
        return {
            chatid: this.chatId,
            creationdate: this.creationDate,
            members: this.members,
            threads: this.threads
        };
    }
}