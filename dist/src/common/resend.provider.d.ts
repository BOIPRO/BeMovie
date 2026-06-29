import { Resend } from 'resend';
export declare const RESEND_CLIENT = "RESEND_CLIENT";
export declare const ResendProvider: {
    provide: string;
    useFactory: () => Resend;
};
