var setToArray = function(theSet) {
    var theArray = [];
    theSet.forEach(function(item) {
        theArray.push(item);
    });
    
    return theArray;
};

var setFromArray = function(theArray) {
    return new Set(theArray);
};

var mapToObject = function(theMap) {
    var theObject = {};
    theMap.forEach(function(value, key) {
        theObject[key] = value;
    });
    
    return theObject;
};

var mapFromObject = function(theObject) {
    return Object.getOwnPropertyNames(theObject).
        reduce(function(theMap, key) {
            theMap.set(key, theObject[key]);
        }, new Map());
};

var utilities = {
    setToArray: setToArray,
    setFromArray: setFromArray,
    mapToObject: mapToObject,
    mapFromObject: mapFromObject
};

module.exports = utilities;