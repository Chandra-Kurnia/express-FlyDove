import nodemailer from '../configs/nodemailer.js'
import forgotpw from '../templates/templateForgotPassword.js'

const sendEmailForgotPw = (toEmail, token, name) => {
  nodemailer
    .sendMail({
      from: `Zembrani <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Reset password',
      attachments: [
        {
          filename: 'forgotpassword.png',
          path: './src/assets/image/forgotpassword.png',
          cid: 'forgotpw'
        }
      ],
      html: forgotpw(`http://localhost:3000/auth/changepassword/${token}`, name)
    })
    .then((result) => {
      console.log('Nodemailer success')
      console.log(result)
    })
    .catch((err) => {
      console.log(`Nodemailer Error : ${err}`)
    })
}
export default sendEmailForgotPw
