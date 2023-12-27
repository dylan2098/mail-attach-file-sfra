'use strict';

var HashMap = require('dw/util/HashMap');
var Template = require('dw/util/Template');
var Mail = require('dw/net/Mail');

/**
 * gets the render html for the given isml template
 * @param {Object} templateContext - object that will fill template placeholders
 * @param {string} templateName - the name of the isml template to render.
 * @returns {string} the rendered isml.
 */
function getRenderedHtml(templateContext, templateName) {
    var context = new HashMap();

    Object.keys(templateContext).forEach(function (key) {
        context.put(key, templateContext[key]);
    });

    var template = new Template(templateName);
    return template.render(context).text;
}

/**
 * Send an email with a attachments list
 * @param {Object} options - configuration for email
 * @param {string} options.recipient - the recipient
 * @param {string} options.template - the rendering template
 * @param {string} options.subject - the subject
 * @param {string} options.from - senders list
 * @param {Array} options.cc - cc list
 * @param {Array} options.bcc - bcc list
 * @param {Array} options.attachments - attachments list
 * @param {Object} options.context - context for rendering template
 * {dw.system.Status} whether the email was successfully queued (Status.OK) or not (Status.ERROR).
 */
function sendMailWithAttachments(options) {
    if (!options.template || !options.recipient || !options.subject) {
        return;
    }

    var email = new Mail();

    email.setSubject(options.subject);
    email.setFrom(options.from);
    email.addTo(options.recipient);

    if (Array.isArray(options.cc) && options.cc.length > 0) {
        options.cc.forEach(function (ccEmail) {
            email.addCc(ccEmail);
        });
    }

    if (Array.isArray(options.bcc) && options.bcc.length > 0) {
        options.bcc.forEach(function (bccEmail) {
            email.addBcc(bccEmail);
        });
    }

    var content = getRenderedHtml(options.context, options.template);
    email.setContent(content, 'text/html', 'UTF-8');

    if (options.attachments || (options.attachments && !options.attachments.isEmpty())) {
        email.setContent(content, 'multipart/mixed; boundary=------------000001030701020908040900', 'UTF-8');
    } else {
        email.setContent(content, 'text/html', 'UTF-8');
    }
    email.send();
}

module.exports = {
    sendMailWithAttachments: sendMailWithAttachments
};
