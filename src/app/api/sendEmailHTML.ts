// app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email, mensajeHtml, asunto } = await request.json();

    // Validar que los campos existan
    if (!email || !mensajeHtml || !asunto) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const userMail = process.env.MAIL_USER;
    const passMail = process.env.MAIL_PASS;

    if (!userMail || !passMail) {
      console.error(" Faltan variables de entorno MAIL_USER o MAIL_PASS");
      return NextResponse.json(
        { error: "Configuración de email incompleta" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true para 465, false para otros puertos
      auth: {
        user: userMail,
        pass: passMail,
      },
    });

    await transporter.sendMail({
      from: '"App Metrofem" <no-reply@appmetrofem.com>', // sender address
      to: email, // list of receivers
      subject: asunto, // Subject line
      html: mensajeHtml, // html body
      text: mensajeHtml, // plain text body
    });

    return NextResponse.json(
      { message: "Mensaje enviado correctamente" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error(" Error enviando email:", error);
    return NextResponse.json(
      { error: "Error al enviar el email", details: error.message },
      { status: 500 }
    );
  }
}