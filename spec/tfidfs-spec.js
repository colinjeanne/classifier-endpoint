var Tokenizer = require('./../tokenizer'),
    englishTokenizer = new Tokenizer(),
    TfIdf = require('./../tfidf');

describe('The Tf-Idf calculator', function() {
    it('should add documents', function() {
        var tfidfCalculator = new TfIdf(englishTokenizer);
        
        tfidfCalculator.addDocument('The quick brown brown fox', 'A');
        expect(tfidfCalculator.documents.length).toEqual(1);
        
        var document = tfidfCalculator.documents[0];
        expect(document.group).toEqual('A');
        expect(document.tfs.size).toEqual(4);
        expect(tfidfCalculator.documentFrequencies.size).toEqual(4);
    });
    
    it('should calculate idfs', function() {
        var tfidfCalculator = new TfIdf(englishTokenizer);
        
        tfidfCalculator.addDocument('this is a sample', 'A');
        tfidfCalculator.addDocument('this is another example', 'A');
        tfidfCalculator.calculateTfIdfs();
        
        var tfidfs = tfidfCalculator.getTfIdfsForGroup('A');
        expect(tfidfs.length).toEqual(2);
        expect(tfidfs[0].get('THIS')).toEqual(0);
        expect(tfidfs[0].get('IS')).toEqual(0);
        expect(tfidfs[0].get('A')).toBeCloseTo(Math.log(2), 2);
    });
    
    it('should calculate the tfidf for a document that isn\'t in the set', function() {
        var tfidfCalculator = new TfIdf(englishTokenizer);
        
        tfidfCalculator.addDocument('this is a sample', 'A');
        tfidfCalculator.addDocument('this is another example', 'A');
        tfidfCalculator.calculateTfIdfs();
        
        var tfidfs = tfidfCalculator.getPotentialTfIdfs('this is a third sample');
        expect(tfidfs.get('THIS')).toEqual(0);
        expect(tfidfs.get('IS')).toEqual(0);
        expect(tfidfs.get('A')).toBeCloseTo(Math.log(2), 2);
        expect(tfidfs.get('THIRD')).toEqual(0);
        expect(tfidfs.get('SAMPLE')).toBeCloseTo(Math.log(2), 2);
    });
});