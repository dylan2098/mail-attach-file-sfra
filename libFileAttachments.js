/**
* @output PDFMapBase64 : dw.util.Map
*/

var StringUtils = require('dw/util/StringUtils');
var HashMap = require('dw/util/HashMap');
var File = require('dw/io/File');
var FileReader = require('dw/io/FileReader');
var StringWriter = require('dw/io/StringWriter');
var Logger = require('dw/system/Logger');

/**
* Encodes a string into a base64 string with an email-safe line width
* @param {string} str String the string to encode
* @param {string} characterEncoding String the character encoding (i.e. 'ISO-8859-1')
* @return {string} strBase64LB - base64 string
*/
function encodeBase64ForEmail(str, characterEncoding) {
    var strBase64 = StringUtils.encodeBase64(str, characterEncoding);
    var strBase64LB = '';
    var stringWriter = new StringWriter();

    var offset = 0;
    var length = 76;

    while (offset < strBase64.length) {
        var maxOffset = offset + length;
        if (strBase64.length >= maxOffset) {
            stringWriter.write(strBase64, offset, length);
            stringWriter.write('\n');
        } else {
            stringWriter.write(strBase64, offset, length - (maxOffset - strBase64.length));
        }
        offset += length;
    }

    stringWriter.flush();
    strBase64LB = stringWriter.toString();
    stringWriter.close();

    return strBase64LB;
}

/**
* Gets existing base64 encoded files that can be attached at the email.
* Please note: Since encoding is all done in memory, the size of attached files should be limited to the absolute minimum
* @param {ArrayList} fileList ArrayList the list of files
* @return {HashMap} - Map with file name / base64 encoded content pairs
*/
function getBase64EncodedAttachments(fileList) {
    if (empty(fileList)) {
        return null;
    }
    var pdfMapBase64 = new HashMap();
    var iterator = fileList.iterator();
    var filePath;
    while (iterator.hasNext()) {
        filePath = iterator.next();
        var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        if (!pdfMapBase64.containsKey(fileName)) {
            try {
                var fileReader = new FileReader(new File(filePath), 'ISO-8859-1');
                var pdf = fileReader.string;
                var pdfBase64 = encodeBase64ForEmail(pdf, 'ISO-8859-1');
                pdfMapBase64.put(fileName, pdfBase64);
            } catch (err) {
                Logger.error('*Error: Send email with attachments -' + err.message);
            }
        }
    }
    return pdfMapBase64;
}

module.exports = {
    encodeBase64ForEmail: encodeBase64ForEmail,
    getBase64EncodedAttachments: getBase64EncodedAttachments
};
