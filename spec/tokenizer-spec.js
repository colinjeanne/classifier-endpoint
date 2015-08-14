var Tokenizer = require('./../tokenizer'),
    englishTokenizer = new Tokenizer();

describe('The English tokenizer', function() {
    it('should tokenize simple words', function() {
        var tokens = englishTokenizer.tokenize('The quick brown fox');
        expect(tokens).toEqual(['The', 'quick', 'brown', 'fox']);
    });
    
    it('should tokenize contractions', function() {
        var tokens = englishTokenizer.tokenize('don\'t I\'ve foo-bar');
        expect(tokens).toEqual(['don\'t', 'I\'ve', 'foo-bar']);
    });
    
    it('should ignore leading and trailing punctuation', function() {
        var tokens = englishTokenizer.tokenize('!What, did the fox say?');
        expect(tokens).toEqual(['What', 'did', 'the', 'fox', 'say']);
    });
    
    it('should tokenize across line breaks', function() {
        var tokens = englishTokenizer.tokenize(
            'What \
            did \
            the \
            fox \
            say');
        expect(tokens).toEqual(['What', 'did', 'the', 'fox', 'say']);
    });
});