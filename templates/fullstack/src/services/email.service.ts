import { Resend } from "resend";
import { logger } from "../config/logger.js";
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

type VerificationEmailInput = {
    to: string;
    verifyUrl: string;
}

export async function sendVerificationEmail({
    to,
    verifyUrl,
}: VerificationEmailInput): Promise<void> {
    const from = env.EMAIL_FROM;
    if (!from) {
        logger.error('EMAIL_FROM is not set');
        return;
    }

    const { data, error } = await resend.emails.send({
        from,
        to: [to],
        subject: 'Verify your email address',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your account.</p>
          <p>
            <a href="${verifyUrl}" style="background:#111;color:#fff;padding:10px 14px;text-decoration:none;border-radius:6px;">
              Verify Email
            </a>
          </p>
          <p>If the button does not work, copy this link:</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        </div>
      `,
      text: `Verify your email: ${verifyUrl}`,
      tags: [{ name: 'type', value: 'email_verification' }],
    });

    if (error) {
        logger.error({ error, to}, 'Failed to send verification email');
        return;
    }

    logger.info({ emailId: data?.id, to }, 'Varification email sent successfully');
}