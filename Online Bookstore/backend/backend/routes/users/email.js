// email.js
const nodemailer = require('nodemailer');

class EmailService {
    constructor(user, pass) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'team9bookstore@gmail.com',
                pass: 'vgyv liya ywuu bvco'
             }
        });
        this.fromEmail = 'team9bookstore@gmail.com';
    }

    async sendConfirmationEmail(toEmail, username, userId) {
        const activationLink = `http://localhost:3000/api/users/activate/${userId}`;
        const mailOptions = {
            from: this.fromEmail,
            to: toEmail,
            subject: 'Registration Confirmation',
            text: `Hello ${username},\n\nThank you for registering!\nClick the link to activate your account:\n${activationLink}\n\nTeam 9`
        };
        await this.transporter.sendMail(mailOptions);
    }

    async sendProfileUpdateEmail(toEmail, username) {
        const mailOptions = {
            from: this.fromEmail,
            to: toEmail,
            subject: 'Profile Updated Successfully',
            text: `Hello ${username},\n\nYour profile information was successfully updated.\n\nBest regards,\nTeam 9`
        };
        await this.transporter.sendMail(mailOptions);
    }

    async sendPromoEmail(toEmail, username, discount, expiration, promoName, promoCode) {
        const mailOptions = {
            from: this.fromEmail,
            to: toEmail,
            subject: `New Promotion: ${promoName}`,
            text: `Hello ${username},\n\nWe're excited to announce our ${promoName}!
            Use promo code ${promoCode} to enjoy ${discount}% off your next purchase.
            This offer is valid until ${expiration}.\n\nHappy shopping!\nTeam 9`
        };
        await this.transporter.sendMail(mailOptions);
    }
}   

const sendConfirmationEmail = (toEmail, username, userId) => {
    return emailService.sendConfirmationEmail(toEmail, username, userId);
};

emailService = new EmailService();

module.exports = { EmailService, sendConfirmationEmail };