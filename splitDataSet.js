var fs = require('fs'),
    dataSet = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8')),
    testSetLength = process.argv[3],
    trainingSetLength = (process.argv.length > 4) ? process.argv[4] : dataSet.length - testSetLength,
    testSet,
    trainingSet;

if (trainingSetLength < 1) {
    throw new Error('Data set does not contain enough records to create a training and test set');
}

trainingSet = dataSet.splice(0, trainingSetLength);
testSet = dataSet.splice(0, testSetLength);

fs.writeFileSync('trainingSet.json', JSON.stringify(trainingSet));
fs.writeFileSync('testSet.json', JSON.stringify(testSet));