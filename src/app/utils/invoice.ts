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
    downloadLink?: string;
};

export const generateInvoicePDF = async (data: InvoiceData): Promise<Buffer> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const buffer: Uint8Array[] = [];

            doc.on('data', (chunk) => buffer.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffer)));
            doc.on('error', (err) => reject(err));

            // Title Section
            doc
                .fontSize(24)
                .font('Helvetica-Bold')
                .text('Tour Booking Invoice', { align: 'center' })
                .moveDown();

            doc
                .fontSize(12)
                .font('Helvetica')
                .text('------------------------------------------', { align: 'center' })
                .moveDown();

            // Customer & Booking Info Section
            doc
                .fontSize(14)
                .text('Customer Information', { align: 'left' })
                .moveDown(0.5);

            doc
                .fontSize(12)
                .text(`Customer Name: ${data.customerName}`)
                .text(`Tour Title: ${data.tourName}`)
                .text(`Payment ID: ${data.paymentId}`)
                .text(`Guests: ${data.guestCount}`)
                .text(`Booking Date: ${new Date(data.date).toLocaleDateString()}`)
                .moveDown();

            // Billing Section
            doc
                .fontSize(14)
                .text('Billing Summary', { align: 'left' })
                .moveDown(0.5);

            doc
                .fontSize(12)
                .text(`Total Amount Paid: $${data.amount.toFixed(2)}`)
                .moveDown(1);

            // Footer Section
            doc
                .fontSize(10)
                .text('Thank you for booking with us! We hope you have an amazing experience.', {
                    align: 'center'
                })
                .moveDown(3);

            // Footer Line
            doc
                .fontSize(10)
                .text('------------------------------------------', { align: 'center' })
                .moveDown();

            doc.end();
        });
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw new AppError(500, `PDF creation error: ${error.message}`);
    }
};