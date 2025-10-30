import axios from "axios";

export async function sendEmail(email: string, mensajeHtml: string, asunto: string) {
    const response = await axios.post('/api/sendEmailHTML', {
        email,
        mensajeHtml,
        asunto
    });
    return response.data;
}