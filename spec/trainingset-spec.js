var fs = require('fs'),
    trainingSet = JSON.parse(fs.readFileSync('trainingSet.json', 'utf-8')),
    testSet = JSON.parse(fs.readFileSync('testSet.json', 'utf-8')),
    NaiveBayesClassifier = require('./../naiveBayesClassifier'),
    classifier = new NaiveBayesClassifier();

trainingSet.forEach(function(document) {
    classifier.addDocument(document.full_text, document.category);
});

classifier.train();

describe('Classifier training', function() {
    testSet.forEach(function(document) {
        it('should properly classify documents', function() {
            var category = classifier.classify(document.full_text);
            expect(category).toEqual(document.category);
        });
    });
});