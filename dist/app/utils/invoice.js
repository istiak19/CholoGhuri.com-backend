"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePDF = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = require("../errors/AppError");
;
const generateInvoicePDF = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
            const buffer = [];
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
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw new AppError_1.AppError(500, `PDF creation error: ${error.message}`);
    }
});
exports.generateInvoicePDF = generateInvoicePDF;
