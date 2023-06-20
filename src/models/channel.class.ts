import { Timestamp } from "@angular/fire/firestore";

export class Channel {
    channelId: string = '';
    creationDate: Timestamp = Timestamp.now();
    creatorId: string = '';
    type: string = 'public';
    description: string = '';
    name: string = '';
    members: string[] = [];
    threads: string[] = [];

    constructor(channelId: string, creationDate: Timestamp, creatorId: string, type: string, description: string, name: string, members: string[], threads: string[]) {
        this.channelId = channelId;
        this.creationDate = creationDate;
        this.creatorId = creatorId;
        this.type = type;
        this.description = description;
        this.name = name;
        this.members = members;
        this.threads = threads;        
    }

    
    toJSON() {
        return {
            channelid: this.channelId,
            creationdate: this.creationDate,
            creatorid: this.creatorId,
            type: this.type,
            description: this.description,
            name: this.name,
            members: this.members,
            threads: this.threads
        };
    }
}
