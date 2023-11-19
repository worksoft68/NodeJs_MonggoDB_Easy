const nodemailer = require("nodemailer");
const systemConf = require(__path_configs + 'system')

async function sendEmail(options) {
    try {
        let transporter = nodemailer.createTransport({
            host: systemConf.SMTP_HOST,
            port: systemConf.SMTP_PORT,
            auth: {
                user: systemConf.SMTP_EMAIL,
                pass: systemConf.SMTP_PASS,
            },
        });

        let mailOptions = {
            from: `${systemConf.FORM_NAME} <${systemConf.FORM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.message + " <br /><br /> <br />  <font color=\"#f00\"> Please do not reply to this message. Since this message is sent automatically from the system </font>"
        };
        let info = await transporter.sendMail(mailOptions);
        if (info) return true;
        return false;
    }
    catch (error) {

    }
    return false;
    // console.log("Message sent: %s", info.messageId);
}
async function sendEmailMicrosoft(options) {
    try {
        let transporter = nodemailer.createTransport({
            host: systemConf.SMTP_HOST,
            port: systemConf.SMTP_PORT,
            auth: {
                user: systemConf.SMTP_EMAIL,
                pass: systemConf.SMTP_PASS,
            },
        });

        let mailOptions = {
            from: `${systemConf.FORM_NAME} <${systemConf.FORM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.message + " <br /><br /> <br />  <font color=\"#f00\"> Please do not reply to this message. Since this message is sent automatically from the system </font>"
        };
        let info = await transporter.sendMail(mailOptions);
        if (info) return true;
        return false;
    }
    catch (error) {

    }
    return false;
    // console.log("Message sent: %s", info.messageId);
}

module.exports = { sendEmail, sendEmailMicrosoft };