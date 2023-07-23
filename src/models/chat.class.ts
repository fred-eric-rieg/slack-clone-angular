import { Timestamp } from "@angular/fire/firestore";

export class Chat {
    chatId: string = '';
    creationDate: Timestamp = Timestamp.now();
    members: string[] = [];
    messages: string[] = [];

    constructor(obj: any) {
        this.chatId = obj && obj.chatId || '';
        this.creationDate = obj && obj.creationDate;
        this.members = obj && obj.members || [];
        this.messages = obj && obj.messages || [];
    }


    toJSON() {
        return {
            chatid: this.chatId,
            creationdate: this.creationDate,
            members: this.members,
            messages: this.messages
        };
    }
}