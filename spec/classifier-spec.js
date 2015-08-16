var trainingSet = [
    {
        "category": "Food",
        "full_text": "What could be better than less ice cream? Eating more ice cream! Ice cream is good to eat."
    },
    {
        "category": "Games",
        "full_text": "What could be better than less game time? More game time!"
    },
    {
        "category": "Food",
        "full_text": "Who likes to play a game with your food? We do then we eat it because it's good!"
    },
    {
        "category": "Games",
        "full_text": "Make your enemies eat the dust while playing this great game!"
    }
];

var NaiveBayesClassifier = require('./../naiveBayesClassifier'),
    classifier = new NaiveBayesClassifier();
 
trainingSet.forEach(function(document) {
    classifier.addDocument(document.full_text, document.category);
});
 
classifier.train();

describe('Classifier', function() {
    it('should classify games', function() {
        var category = classifier.classify('This game is better');

        expect(category).toEqual('Games');
    });

    it('should classify food', function() {
        var category = classifier.classify('I like to play');

        expect(category).toEqual('Food');
    });
    
    it('should reload its state', function() {
        var json = JSON.stringify(classifier);
        var loadedClassifier = NaiveBayesClassifier.load(JSON.parse(json));
        
        var category = loadedClassifier.classify('This game is better');

        expect(category).toEqual('Games');
    });
});
