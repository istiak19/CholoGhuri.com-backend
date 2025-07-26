/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from 'pdfkit';
import { AppError } from '../errors/AppError';

export interface InvoiceData {
    customerName: string;
    tourName: string;
    paymentId: string;
    amount: number;
    date: Date;
    guestCount: number;
    downloadLink?: string
};

export const generateInvoicePDF = async (data: InvoiceData): Promise<Buffer> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const buffer: Uint8Array[] = [];

            doc.on('data', (chunk) => buffer.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffer)));
            doc.on('error', (err) => reject(err));

            // Title
            doc
                .fontSize(20)
                .text('Tour Booking Invoice', { align: 'center' })
                .moveDown();

            // Customer & Booking Info
            doc
                .fontSize(12)
                .text(`Customer Name: ${data.customerName}`)
                .text(`Tour Title: ${data.tourName}`)
                .text(`Payment ID: ${data.paymentId}`)
                .text(`Guests: ${data.guestCount}`)
                .text(`Booking Date: ${data.date}`)
                .text(`Total Amount Paid: $${data.amount.toFixed(2)}`)
                .moveDown();

            // Footer
            doc
                .fontSize(12)
                .text('Thank you for booking with us!', { align: 'center' });

            doc.end();
        });
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw new AppError(500, `PDF creation error: ${error.message}`);
    }
};