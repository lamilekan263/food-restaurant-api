require('dotenv').config();
import nodemailer, { Transporter } from 'nodemailer'
import ejs from 'ejs'
import path from 'path'

interface ISendMailBody {
    email: string,
    subject: string,
    template: string,
    data: { [key: string]: any }
}

export const sendMail = async (options: ISendMailBody) => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '578'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const { email, subject, template, data } = options;
   
    const renderPath = path.join(__dirname, '../mail', template)

    const html = await ejs.renderFile(renderPath, data)

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html
    }

    await transporter.sendMail(mailOptions)

};

