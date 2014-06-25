var parseString = require('xml2js').parseString;

exports.parse = function(xml_string, callback){

    // Parse xml to JSON
    parseString(xml_string, function (err, result) {
        callback(null, result);
    });
};