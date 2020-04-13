export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // uso de SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Fastfeet <noreply@fastfeet.com>',
  },
};
