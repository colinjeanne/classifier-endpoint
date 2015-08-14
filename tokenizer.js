var punctuation = '[\\u2000-\\u206F\\u2E00-\\u2E7F\\\'!"#$%&()*+,\\-.\\/:;<=>?@\\[\\]^_`{|}~]',
    punctuationRegex = new RegExp('^\\s*' + punctuation + '*\\s*$'),
    splitRegex = new RegExp('((^' + punctuation + '+)|(' + punctuation + '*\\s+' + punctuation + '*)|(' + punctuation + '+$))');

function tokenize2(text) {
    return text.
        replace('.', ' ').
        replace(/[\u2000-\u206F\u2E00-\u2E7F\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '').
        split(/\s+/).
        filter(function(word) {
            // Splitting the string will return any undefined or whitespace
            // results as well
            return word && !/\s+/.test(word);
        });
}

function tokenize(text) {
    return text.
        split(splitRegex).
        filter(function(word) {
            // Splitting the string will return any undefined or punctuation
            // results as well
            return word && !punctuationRegex.test(word);
        });
}

var Tokenizer = function() {
    this.tokenize = tokenize;
};

module.exports = Tokenizer;