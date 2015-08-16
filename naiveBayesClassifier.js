var utilities = require('./utilities'),
    Tokenizer = require('./tokenizer'),
    TfIdf = require('./tfidf'),
    fs = require('fs');

var calculateTfIdfProbabilities = function(words, documentTfIdfs, smoothingParameter) {
    var wordTfIdfTotals = new Map(),
        totalTfIdf = 0,
        probabilities = new Map(),
        totalWords = words.size;
    
    documentTfIdfs.forEach(function(tfidfs) {
        words.forEach(function(word) {
            var tfidf = tfidfs.has(word) ? tfidfs.get(word) : 0;
            
            totalTfIdf += tfidf;
            
            if (wordTfIdfTotals.has(word)) {
                wordTfIdfTotals.set(word, wordTfIdfTotals.get(word) + tfidf);
            } else {
                wordTfIdfTotals.set(word, tfidf);
            }
        });
    });
    
    wordTfIdfTotals.forEach(function(tfidf, word) {
        var smoothedEstimate =
            (wordTfIdfTotals.get(word) + smoothingParameter) /
            (totalTfIdf + smoothingParameter * totalWords);
        
        probabilities.set(word, smoothedEstimate);
    });
    
    return probabilities;
};

var calculateProbabilityFromWords = function(potentialTfIdfs, tfidfProbabilities) {
    var probabilityFromWords = 0;
    
    potentialTfIdfs.forEach(function(tfidf, word) {
        var tfidfProbability,
            logTfIdfProbability;
        
        if (tfidfProbabilities.has(word)) {
            tfidfProbability = tfidfProbabilities.get(word);
            logTfIdfProbability = Math.log(tfidfProbability);
            
            probabilityFromWords += tfidf * logTfIdfProbability;
        }
    });
    
    return probabilityFromWords;
};

var NaiveBayesClassifier = function() {
    this.tfidf = new TfIdf(new Tokenizer());
    this.classes = new Map();
    this.totalDocuments = 0;
};

NaiveBayesClassifier.prototype.addDocument = function(text, classification) {
    this.tfidf.addDocument(text, classification);
    
    ++this.totalDocuments;
    if (this.classes.has(classification)) {
        this.classes.set(classification, this.classes.get(classification) + 1);
    } else {
        this.classes.set(classification, 1);
    }
};

NaiveBayesClassifier.prototype.train = function() {
    var words = this.tfidf.words;
    
    this.tfidf.calculateTfIdfs();
    
    this.classificationProbabilities = new Map();
    this.classes.forEach(function(documentCount, group) {
        var groupTfIdfs = this.tfidf.getTfIdfsForGroup(group);
        
        var groupProbability = {
            classification: Math.log(documentCount / this.totalDocuments),
            tfidfProbabilities: calculateTfIdfProbabilities(words, groupTfIdfs, 1)
        };
        
        this.classificationProbabilities.set(group, groupProbability);
    }, this);
};

NaiveBayesClassifier.prototype.classify = function(text) {
    var potentialTfIdf = this.tfidf.getPotentialTfIdfs(text),
        highestProbability = {
            classification: '',
            probability: Number.MIN_SAFE_INTEGER
        };
        
    this.classes.forEach(function(documentCount, classification) {
        var probabilities = this.classificationProbabilities.get(classification),
            wordProbability =
            calculateProbabilityFromWords(
                potentialTfIdf,
                probabilities.tfidfProbabilities),
            probability = probabilities.classification + wordProbability;
        
        if (highestProbability.probability < probability) {
            highestProbability.classification = classification;
            highestProbability.probability = probability;
        }
    }, this);
    
    return highestProbability.classification;
};

var classificationProbabilitiesToObject = function(classificationProbabilities) {
    var theObject = {};
    classificationProbabilities.forEach(function(probabilities, classification) {
        theObject[classification] = {
            classification: probabilities.classification,
            tfidfProbabilities: utilities.mapToObject(probabilities.tfidfProbabilities)
        };
    });
    
    return theObject;
};

var classificationProbabilitiesFromObject = function(theObject) {
    var classificationProbabilities = new Map();
    
    Object.getOwnPropertyNames(theObject).forEach(function(classification) {
        var probabilities = theObject[classification];
        
        classificationProbabilities.set(
            classification,
            {
                classification: probabilities.classification,
                tfidfProbabilities: utilities.mapFromObject(probabilities.tfidfProbabilities)
            });
    });
    
    return classificationProbabilities;
};

NaiveBayesClassifier.prototype.toJSON = function() {
    return {
        tfidf: this.tfidf,
        classes: utilities.mapToObject(this.classes),
        classificationProbabilities: classificationProbabilitiesToObject(this.classificationProbabilities),
        totalDocuments: this.totalDocuments
    };
};

NaiveBayesClassifier.load = function(json) {
    var loadedState = new NaiveBayesClassifier();
    
    loadedState.tfidf = TfIdf.load(json.tfidf);
    loadedState.classes = utilities.mapFromObject(json.classes);
    loadedState.classificationProbabilities =
        classificationProbabilitiesFromObject(json.classificationProbabilities);
    loadedState.totalDocuments = json.totalDocuments;
    
    return loadedState;
};

module.exports = NaiveBayesClassifier;