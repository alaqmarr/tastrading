import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Admin email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, productName, productId } = body;

    // Validate required fields
    if (!name || !email || !productName) {
      return NextResponse.json(
        { error: "Name, email, and product are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Save to database as contact message
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message: `[Quote Request for: ${productName}]\n\n${
          message || "Customer requested a quote."
        }`,
      },
    });

    // Send emails only if Gmail credentials are configured
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // 1. Email to Admin
      const adminMailOptions = {
        from: process.env.GMAIL_USER,
        to: ADMIN_EMAIL,
        subject: `🛒 New Quote Request: ${productName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Quote Request</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #374151; margin-top: 0;">Product Details</h2>
              <p style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                <strong style="color: #10b981;">${productName}</strong><br>
                <a href="${
                  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
                }/products/${productId}" style="color: #059669;">View Product →</a>
              </p>
              
              <h2 style="color: #374151;">Customer Information</h2>
              <table style="width: 100%; background: white; border-radius: 8px; padding: 15px;">
                <tr><td style="padding: 8px; color: #6b7280;"><strong>Name:</strong></td><td style="padding: 8px;">${name}</td></tr>
                <tr><td style="padding: 8px; color: #6b7280;"><strong>Email:</strong></td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 8px; color: #6b7280;"><strong>Phone:</strong></td><td style="padding: 8px;">${
                  phone || "Not provided"
                }</td></tr>
              </table>
              
              ${
                message
                  ? `
                <h2 style="color: #374151;">Additional Details</h2>
                <p style="background: white; padding: 15px; border-radius: 8px;">${message}</p>
              `
                  : ""
              }
              
              <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center;">
                This email was sent from TAS Trading Corporation website.
              </p>
            </div>
          </div>
        `,
      };

      // 2. Thank you email to Customer
      const customerMailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Thank you for your inquiry - TAS Trading Corporation`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Thank You, ${name}!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                We have received your quote request for <strong style="color: #10b981;">${productName}</strong>.
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Our team will review your request and get back to you shortly with pricing and availability details.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="color: #6b7280; margin: 0 0 10px 0;">Need immediate assistance?</p>
                <p style="margin: 0;">
                  <a href="tel:9391057437" style="color: #10b981; font-size: 20px; font-weight: bold; text-decoration: none;">
                    📞 9391057437
                  </a>
                </p>
              </div>
              
              <p style="color: #374151; font-size: 14px;">
                Best regards,<br>
                <strong>TAS Trading Corporation</strong><br>
                <span style="color: #6b7280;">Industrial Excellence Since 1968</span>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                This is an automated email. Please do not reply directly to this email.
              </p>
            </div>
          </div>
        `,
      };

      // Send emails
      try {
        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(customerMailOptions),
        ]);
        console.log("Quote request emails sent successfully");
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        // Don't fail the request, quote was still saved
      }
    } else {
      console.log("Email not configured, skipping email notifications");
    }

    return NextResponse.json(
      { success: true, message: "Quote request submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quote request error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
