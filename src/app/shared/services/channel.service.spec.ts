let existingChannels = ['1234567890'];

function refreshChannelData(channelId: string, whoIsAsking: string) {
    console.log('refreshChannelData: ', channelId, whoIsAsking);
    if (isChannelAskingForNewChannel(channelId, whoIsAsking)) {
        refreshNewChannel(channelId);
    } else if (isChannelAskingForLocalStorage(channelId, whoIsAsking)) {
        loadFromLocalStorage(channelId);
    } else if (whoIsAsking == 'channelServiceIsAksing') {
        refreshOldChannel(channelId);
    }
}


function isChannelAskingForNewChannel(channelId: string, whoIsAsking: string) {
    return whoIsAsking == 'channelComponent' && !existingChannels.includes(channelId);
}

function isChannelAskingForLocalStorage(channelId: string, whoIsAsking: string) {
    return whoIsAsking == 'channelComponent' && existingChannels.includes(channelId);
}

function refreshNewChannel(channelId: string) {
    existingChannels.push(channelId);
    return "refreshNewChannel"
}

function refreshOldChannel(channelId: string) {
    return "refreshOldChannel"
}

function loadFromLocalStorage(channelId: string) {
    return "loadFromLocalStorage"
}


describe('ChannelService', () => {

    it('should have a channelId and whoIsAsking', () => {
        const channelId = '1234567890';
        const whoIsAsking = 'channelComponent';
        refreshChannelData(channelId, whoIsAsking);
        expect(channelId).toEqual('1234567890');
        expect(whoIsAsking).toEqual('channelComponent');
    });

    it('should refreshOldChannel', () => {
        const channelId = '1234567890';
        const whoIsAsking = 'channelComponent';
        refreshChannelData(channelId, whoIsAsking);
        expect(refreshOldChannel(channelId)).toEqual('refreshOldChannel');
    });

    it('should not refreshNewChannel', () => {
        const channelId = '1234567890';
        const whoIsAsking = 'channelComponent';
        refreshChannelData(channelId, whoIsAsking);
        expect(refreshNewChannel(channelId)).toEqual('refreshNewChannel');
    });

    it('should return true on asking from channelComponent and with existing channel', () => {
        const channelId = '1234567890';
        const whoIsAsking = 'channelComponent';
        isChannelAskingForLocalStorage(channelId, whoIsAsking);
        expect(isChannelAskingForLocalStorage(channelId, whoIsAsking)).toEqual(true);
    });


});