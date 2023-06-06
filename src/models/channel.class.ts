export class Channel {
    id: string = '';
    title: string = '';
    description: string = '';
    isDirectMessage: boolean = false;
    isArchived: boolean = false;
    isPublic: boolean = false;
    creationDate: Date = new Date();
    creatorId: string = 'ös039jFjkdT5ika9xC';
    creatorName: string = 'Herbert';
    members: any[] = [
        { userId: 'kasd0923jaSDO21S', userName: 'Adam' },
        { userId: 'iajsidRkjoakd?KSOP', userName: 'Eva' },
        { userId: 'asdk12llsopvpüüÜi1j2o3i1', userName: 'Timmy' },
        { userId: 'asdkj2o3i1j2o3i1', userName: 'Cartman' },
        { userId: 'jasidjsdijfp2laj', userName: 'Elli' }
    ];
    messages: any[] = [
        { messageId: 'PsdiioajweX239xS', userId: 'kasd0923jaSDO21S', userName: 'Adam', message: 'Hello World!', date: new Date(), attachedImage: null, attachedFile: null, link: null },
        { messageId: 'KGO23kaxoP192iXjsn', userId: 'iajsidRkjoakd?KSOP', userName: 'Eva', message: 'Hello World!', date: new Date(), attachedImage: null, attachedFile: null, link: null },
        { messageId: 'Looasj2999fghjKAs', userId: 'asdk12llsopvpüüÜi1j2o3i1', userName: 'Timmy', message: 'Hello World!', date: new Date(), attachedImage: null, attachedFile: null, link: null },
        { messageId: 'qoypd20sApqmmcG8k2n', userId: 'asdkj2o3i1j2o3i1', userName: 'Cartman', message: 'Hello World!', date: new Date(), attachedImage: null, attachedFile: null, link: null },
        { messageId: 'üödka10xjj230xu8ns93', userId: 'jasidjsdijfp2laj', userName: 'Elli', message: 'Hello World! <b>bold</b> & <i>italic</i> <u>underlined</u>', date: new Date(), attachedImage: 'https://www.w3schools.com/w3css/img_lights.jpg', attachedFile: 'file_link', link: 'https://www.example.com' },
    ];
}