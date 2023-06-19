import { Timestamp } from "@angular/fire/firestore";

export class Message {
    messageId: string = '';
    creatorId: string = '';
    creationDate: Timestamp = Timestamp.now();
    text: string = '';

    constructor(messageId: string, creatorId: string, creationDate: Timestamp, text: string) {
        this.messageId = messageId;
        this.creatorId = creatorId;
        this.creationDate = creationDate;
        this.text = text;
    }


    toJSON() {
        return {
            messageId: this.messageId,
            creatorId: this.creatorId,
            creationDate: this.creationDate,
            text: this.text
        }
    }
}