"use client";

import { useState } from "react";
import { sendEmail } from "@/services/email";

export default function SendEmailButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendEmail = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await sendEmail(
        "henaokarina17@gmail.com", 
        "<h1>¡Hola!</h1><p>Este es un email de prueba desde el dashboard.</p>",
        "Prueba de email desde dashboard"
      );

      setMessage(response.message);
    } catch (error: any) {
      console.error("Error:", error);
      setMessage(" Error: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleSendEmail}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? "Enviando..." : "Enviar Email de Prueba"}
      </button>
      
      {message && (
        <p className={`mt-4 ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}