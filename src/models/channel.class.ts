export class Channel {
    channelId: string = '';
    title: string = '';
    // description: string = '';
    // isDirectMessage: boolean = false;
    // isArchived: boolean = false;
    // isPublic: boolean = false;
    // creationDate: Date = new Date();
    // creatorId: string = 'ös039jFjkdT5ika9xC';
    // creatorName: string = 'Herbert';
    // members: { userId: string; userName: string }[] = [];
    // messages: {
    //     messageId: string;
    //     userId: string;
    //     userName: string;
    //     message: string;
    //     date: Date;
    //     attachedImage: string | null;
    //     attachedFile: string | null;
    //     link: string | null;
    // }[] = [];

    constructor(
        channelId: string,
        title: string,
        // description: string,
        // isDirectMessage: boolean,
        // isArchived: boolean,
        // isPublic: boolean,
        // creationDate: Date,
        // creatorId: string,
        // creatorName: string,
        // members: { userId: string; userName: string }[],
        // messages: {
        //     messageId: string;
        //     userId: string;
        //     userName: string;
        //     message: string;
        //     date: Date;
        //     attachedImage: string | null;
        //     attachedFile: string | null;
        //     link: string | null;
        // }[]
    ) {
        this.channelId = channelId;
        this.title = title;
        // this.description = description;
        // this.isDirectMessage = isDirectMessage;
        // this.isArchived = isArchived;
        // this.isPublic = isPublic;
        // this.creationDate = creationDate;
        // this.creatorId = creatorId;
        // this.creatorName = creatorName;
        // this.members = members;
        // this.messages = messages;
    }

    toJSON() {
        return {
            channelId: this.channelId,
            title: this.title,
            // description: this.description,
            // isDirectMessage: this.isDirectMessage,
            // isArchived: this.isArchived,
            // isPublic: this.isPublic,
            // creationDate: this.creationDate,
            // creatorId: this.creatorId,
            // creatorName: this.creatorName,
            // members: this.members,
            // messages: this.messages
        };
    }
}
