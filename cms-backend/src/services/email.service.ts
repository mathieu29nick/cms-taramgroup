import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async ({
  subject,
  html,
  recipients,
}: {
  subject: string;
  html: string;
  recipients: string[];
}) => {
  await resend.emails.send({
    from: "CMS <onboarding@resend.dev>",
    to: recipients.join(","),
    subject,
    html,
  });
};