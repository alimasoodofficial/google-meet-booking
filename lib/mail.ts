import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingConfirmation = async (details: {
  to: string;
  name: string;
  date: string;
  time: string;
  meetLink: string;
}) => {
  const { to, name, date, time, meetLink } = details;

  const mailOptions = {
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Booking Confirmed: Your Video Meeting',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0836C1;">Booking Confirmed!</h2>
        <p>Hello ${name},</p>
        <p>Your meeting has been successfully scheduled. Here are the details:</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Meeting Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
        </div>
        <p>A Google Calendar invitation has also been sent to you.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated message from your Booking System.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
