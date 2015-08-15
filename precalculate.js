var fs = require('fs'),
    trainingSet = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8')),
    NaiveBayesClassifier = require('./naiveBayesClassifier'),
    classifier = new NaiveBayesClassifier();

console.log('Adding documents');
 
trainingSet.forEach(function(document) {
    classifier.addDocument(document.full_text, document.category);
});

console.log(classifier.totalDocuments + ' documents added');
console.log('Training...');

classifier.train();

console.log('Training complete!');

var classifierState = JSON.stringify(classifier);
fs.writeFileSync('classifier.json', classifierState);