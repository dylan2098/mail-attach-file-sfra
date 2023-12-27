/**
 * Sending an attachment mail due to emailConfigurations and csvFileAttachment
 * @param {Object} emailConfigurationsData Every configuration for email that attach a file
 * @param {dw.io.File} csvFileAttachment CSV file attachment to email
 * @returns {boolean} Is it sending mail or not ?
 */
function sendMailWithCSVAttachment(emailConfigurationsData, csvFileAttachment) {
    if (emailConfigurationsData && csvFileAttachment) {
        var emailHelper = require('*/cartridge/scripts/mail/mailHelpers');
        var ArrayList = require('dw/util/ArrayList');
        var encodingAttachments = require('*/cartridge/scripts/mail/libFileAttachments');
        var customerServiceEmail = emailConfigurationsData.customerServiceEmail;
        var fileList = new ArrayList();
        var context = {};

        if (csvFileAttachment) {
            fileList.add({
                filePath: csvFileAttachment.fullPath,
                fileName: csvFileAttachment.name
            });
            context.base64FileMap = encodingAttachments.getBase64EncodedAttachments(fileList);
        }

        if (customerServiceEmail && emailConfigurationsData && context) {
            var emailConfigurations = {
                recipient: emailConfigurationsData.recipient,
                subject: emailConfigurationsData.subject,
                from: customerServiceEmail,
                attachments: fileList,
                template: 'mail/mailWithAttachment',
                context: context
            };

            if (emailConfigurationsData.cc && emailConfigurationsData.cc.length) {
                emailConfigurations.cc = emailConfigurationsData.cc;
            }

            if (emailConfigurationsData.bcc && emailConfigurationsData.bcc.length) {
                emailConfigurations.bcc = emailConfigurationsData.bcc;
            }

            emailHelper.sendMailWithAttachments(emailConfigurations);
            return true;
        }
    }

    return false;
}


var emailConfigurationsData = {
    customerServiceEmail: mailSender,
    recipient: convertArrayFromString(recipient),
    subject: mailSubject,
    cc: convertArrayFromString(cc),
    bcc: convertArrayFromString(bcc)
};

var csvFileAttachment = createOrderCSVFileWithSchema(orderCSVFilePath, orderCSVFilePrefix, csvWriteSchema);

sendMailWithCSVAttachment(emailConfigurationsData, csvFileAttachment);