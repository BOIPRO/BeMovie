import { Resend } from 'resend';

export const RESEND_CLIENT = 'RESEND_CLIENT';

export const ResendProvider = {
  provide: RESEND_CLIENT,
  useFactory: () => {
    return new Resend(process.env.RESEND_API_KEY);
  },
};