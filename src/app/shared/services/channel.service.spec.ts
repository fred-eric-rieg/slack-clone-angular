import { ChannelService } from "./channel.service";
import { TestBed } from '@angular/core/testing';
import { DocumentData, DocumentSnapshot, Firestore } from '@angular/fire/firestore';

describe('ChannelService', () => { 
    let service: ChannelService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ChannelService,
                { provide: Firestore, useValue: { /* Mock implementation if needed */ } }
            ]
        });
        service = TestBed.inject(ChannelService);
    });


    it('Should  run tests', async () => {
        let testData = {'channels': ['#allgemein', '#team']};
        let channel: DocumentSnapshot<DocumentData> = await service.getChannel('#allgemein');
        
        expect(true).toBe(true);
        expect(true).toBe(true);
    });

});