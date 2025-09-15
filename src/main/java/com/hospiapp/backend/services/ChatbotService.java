package com.hospiapp.backend.services;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class ChatbotService {

    private final Map<String, String> responses = new HashMap<>();
    private final Map<Pattern, String> patternResponses = new HashMap<>();

    public ChatbotService() {
        initializeResponses();
    }

    private void initializeResponses() {
        // Respuestas directas
        responses.put("hola", "¡Hola! Soy el asistente virtual del hospital. ¿En qué puedo ayudarte?");
        responses.put("ayuda", "Puedo ayudarte con información sobre citas médicas, consultas, medicamentos y procesos del hospital.");
        responses.put("gracias", "¡De nada! Estoy aquí para ayudarte cuando lo necesites.");
        responses.put("adios", "¡Hasta luego! Que tengas un buen día.");

        // Patrones para respuestas más complejas
        patternResponses.put(Pattern.compile("(?i).*cita.*agendar.*", Pattern.CASE_INSENSITIVE), 
            "Para agendar una cita médica:\n" +
            "1. Inicia sesión en tu cuenta de paciente\n" +
            "2. Ve a la sección 'Citas'\n" +
            "3. Selecciona 'Nueva Cita'\n" +
            "4. Elige el médico y la fecha disponible\n" +
            "5. Confirma la cita\n\n" +
            "Las citas de emergencia tienen prioridad y se atienden primero.");

        patternResponses.put(Pattern.compile("(?i).*cita.*cancelar.*", Pattern.CASE_INSENSITIVE),
            "Para cancelar una cita:\n" +
            "1. Ve a 'Mis Citas'\n" +
            "2. Encuentra la cita que quieres cancelar\n" +
            "3. Haz clic en 'Cancelar'\n" +
            "4. Confirma la cancelación\n\n" +
            "Puedes cancelar hasta 2 horas antes de la cita.");

        patternResponses.put(Pattern.compile("(?i).*historial.*médico.*", Pattern.CASE_INSENSITIVE),
            "Tu historial médico incluye:\n" +
            "• Todas las consultas realizadas\n" +
            "• Diagnósticos y tratamientos\n" +
            "• Medicamentos recetados\n" +
            "• Fechas de las consultas\n\n" +
            "Puedes acceder a él en la sección 'Mi Historial'.");

        patternResponses.put(Pattern.compile("(?i).*medicamento.*", Pattern.CASE_INSENSITIVE),
            "Información sobre medicamentos:\n" +
            "• Consulta tu historial para ver medicamentos recetados\n" +
            "• Sigue las indicaciones de tu médico\n" +
            "• Si tienes dudas, contacta a tu médico\n" +
            "• En caso de efectos secundarios, consulta inmediatamente");

        patternResponses.put(Pattern.compile("(?i).*emergencia.*", Pattern.CASE_INSENSITIVE),
            "En caso de emergencia:\n" +
            "🚨 Llama al 911 inmediatamente\n" +
            "🏥 Ve al servicio de urgencias\n" +
            "📞 Contacta a tu médico de cabecera\n\n" +
            "Las citas de emergencia en el sistema tienen prioridad máxima.");

        patternResponses.put(Pattern.compile("(?i).*horario.*atención.*", Pattern.CASE_INSENSITIVE),
            "Horarios de atención:\n" +
            "🕐 Lunes a Viernes: 8:00 AM - 6:00 PM\n" +
            "🕐 Sábados: 8:00 AM - 12:00 PM\n" +
            "❌ Domingos: Cerrado\n\n" +
            "Urgencias: 24/7");

        patternResponses.put(Pattern.compile("(?i).*especialista.*", Pattern.CASE_INSENSITIVE),
            "Especialistas disponibles:\n" +
            "• Cardiología\n" +
            "• Pediatría\n" +
            "• Medicina General\n" +
            "• Ginecología\n" +
            "• Traumatología\n\n" +
            "Puedes filtrar por especialidad al agendar citas.");

        patternResponses.put(Pattern.compile("(?i).*resultado.*examen.*", Pattern.CASE_INSENSITIVE),
            "Para consultar resultados de exámenes:\n" +
            "1. Inicia sesión en tu cuenta\n" +
            "2. Ve a 'Resultados de Exámenes'\n" +
            "3. Selecciona el examen que buscas\n" +
            "4. Los resultados aparecerán cuando estén listos\n\n" +
            "Recibirás una notificación cuando estén disponibles.");

        patternResponses.put(Pattern.compile("(?i).*costo.*precio.*", Pattern.CASE_INSENSITIVE),
            "Información sobre costos:\n" +
            "• Consulta general: $50\n" +
            "• Especialista: $80\n" +
            "• Emergencia: $120\n" +
            "• Exámenes: Varían según el tipo\n\n" +
            "Los precios pueden variar. Consulta en recepción para información actualizada.");

        patternResponses.put(Pattern.compile("(?i).*contacto.*", Pattern.CASE_INSENSITIVE),
            "Información de contacto:\n" +
            "📞 Teléfono: (555) 123-4567\n" +
            "📧 Email: info@hospital.com\n" +
            "🌐 Web: www.hospital.com\n" +
            "📍 Dirección: Calle Principal 123, Ciudad\n\n" +
            "Horario de atención telefónica: 8:00 AM - 6:00 PM");
    }

    public String processMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "Por favor, escribe tu pregunta o consulta.";
        }

        String lowerMessage = message.toLowerCase().trim();

        // Buscar respuesta directa
        String directResponse = responses.get(lowerMessage);
        if (directResponse != null) {
            return directResponse;
        }

        // Buscar por patrones
        for (Map.Entry<Pattern, String> entry : patternResponses.entrySet()) {
            if (entry.getKey().matcher(message).matches()) {
                return entry.getValue();
            }
        }

        // Respuesta por defecto si no encuentra coincidencia
        return "Entiendo tu consulta sobre: \"" + message + "\"\n\n" +
               "Aunque no tengo una respuesta específica para esa pregunta, puedo ayudarte con:\n" +
               "• Agendar citas médicas\n" +
               "• Consultar tu historial\n" +
               "• Información sobre medicamentos\n" +
               "• Horarios de atención\n" +
               "• Contacto del hospital\n\n" +
               "¿Hay algo específico en lo que pueda ayudarte?";
    }

    public Map<String, String> getAvailableTopics() {
        Map<String, String> topics = new HashMap<>();
        topics.put("citas", "Información sobre agendar y cancelar citas");
        topics.put("historial", "Consultar historial médico");
        topics.put("medicamentos", "Información sobre medicamentos");
        topics.put("emergencia", "Qué hacer en caso de emergencia");
        topics.put("horarios", "Horarios de atención");
        topics.put("especialistas", "Especialistas disponibles");
        topics.put("exámenes", "Resultados de exámenes");
        topics.put("costos", "Información sobre precios");
        topics.put("contacto", "Datos de contacto del hospital");
        return topics;
    }
}
