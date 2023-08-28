import { ChannelService } from "./channel.service";
import { TestBed } from '@angular/core/testing';
import { DocumentData, DocumentSnapshot, Firestore } from '@angular/fire/firestore';


class FirestoreMock {
    // Hier kannst du Methoden und Eigenschaften des Firestore-Mocks definieren, die du in deinen Tests verwenden möchtest.
    // Zum Beispiel könntest du Mock-Methoden erstellen, die Daten zurückgeben oder Verhalten simulieren.

    collection(firestore: Firestore, collectionPath: string) {
        // Hier könntest du eine Mock-Implementierung für die collection-Methode bereitstellen
        // und eine Dummy-Implementierung eines Firestore-Objekts zurückgeben.
        return {
            // Hier könntest du weitere Methoden oder Eigenschaften des Firestore-Objekts simulieren
        };
    }
    
    // Weitere Mock-Methoden hier
}

describe('ChannelService', () => { 
    let service: ChannelService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ChannelService,
                { provide: Firestore, useClass: { FirestoreMock} }
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