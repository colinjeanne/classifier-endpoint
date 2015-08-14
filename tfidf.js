var utilities = require('./utilities');

var calculateTermFrequencies = function(words) {
    var frequencies = new Map();
    words.forEach(function(word) {
        if (frequencies.has(word)) {
            frequencies.set(word, frequencies.get(word) + 1);
        } else {
            frequencies.set(word, 1);
        }
    });
    
    frequencies.forEach(function(frequency, word) {
        frequencies.set(word, 1 + Math.log(frequency));
    });
    
    return frequencies;
};

var updateDocumentFrequencies = function(documentFrequencies, words) {
    words.forEach(function(word) {
        if (documentFrequencies.has(word)) {
            documentFrequencies.set(word, documentFrequencies.get(word) + 1);
        } else {
            documentFrequencies.set(word, 1);
        }
    });
    
    return documentFrequencies;
};

var calculateIdf = function(documentFrequency, totalDocuments) {
    if (documentFrequency > totalDocuments) {
        throw new Error("Unexpected event creates negative idf");
    }
    
    return Math.log(totalDocuments / documentFrequency);
};

var calculateIdfs = function(documentFrequencies, totalDocuments) {
    var idfs = new Map();
    for (var entry of documentFrequencies) {
        var word = entry[0],
            frequency = entry[1];
        
        idfs.set(word, calculateIdf(frequency, totalDocuments));
    }
    
    return idfs;
};

var calculateTfIdfs = function(tfs, idfs) {
    var tfidfs = new Map();
    for (var entry of tfs) {
        var word = entry[0],
            tf = entry[1],
            idf = idfs.has(word) ? idfs.get(word) : 0;
        
        tfidfs.set(word, tf * idf);
    }
    
    return tfidfs;
};

var TfIdf = function(tokenizer) {
    this.tokenizer = tokenizer;
    this.documents = [];
    this.documentFrequencies = new Map();
    this.idfs = new Map();
    this.words = new Set();
};

TfIdf.prototype.addDocument = function(text, group) {
    var words = this.tokenizer.
        tokenize(text).
        map(function(word) {
            return word.toUpperCase();
        }),
        tfs = calculateTermFrequencies(words),
        uniqueWords = new Set(words);
    
    words.forEach(function(word) {
        this.words.add(word);
    }, this);
    
    this.documents.push({
        tfs: tfs,
        group: group
    });
    
    this.documentFrequencies = updateDocumentFrequencies(
        this.documentFrequencies,
        uniqueWords);
};

TfIdf.prototype.calculateTfIdfs = function() {
    this.idfs = calculateIdfs(this.documentFrequencies, this.documents.length);
    this.documents.forEach(function(document) {
        document.tfidfs = calculateTfIdfs(document.tfs, this.idfs);
    }, this);
};

TfIdf.prototype.getTfIdfsForGroup = function(group) {
    return this.documents.
        filter(function(document) {
            return document.group === group;
        }).
        map(function(document) {
            return document.tfidfs;
        });
};

TfIdf.prototype.getPotentialTfIdfs = function(text) {
    var words = this.tokenizer.
            tokenize(text).
            map(function(word) {
                return word.toUpperCase();
            }),
        tfs = calculateTermFrequencies(words);
    
    return calculateTfIdfs(tfs, this.idfs);
};

TfIdf.prototype.toJSON = function() {
    return {
        documents: this.documents.map(function(document) {
            return {
                tfs: utilities.mapToObject(document.tfs),
                tfidfs: utilities.mapToObject(document.tfidfs),
                group: document.group
            };
        }),
        documentFrequencies: utilities.mapToObject(this.documentFrequencies),
        idfs: utilities.mapToObject(this.idfs),
        words: utilities.setToArray(this.words)
    };
};

module.exports = TfIdf;