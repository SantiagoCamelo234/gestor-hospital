package com.hospiapp.backend.controllers;

import com.hospiapp.backend.domain.usuario.Usuario;
import com.hospiapp.backend.services.AuthService;
import com.hospiapp.backend.services.ChatbotService;
import com.hospiapp.backend.utils.AuthHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final AuthHelper authHelper;

    public ChatbotController(ChatbotService chatbotService, AuthService authService) {
        this.chatbotService = chatbotService;
        this.authHelper = new AuthHelper(authService);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestHeader("Authorization") String token,
                                  @RequestBody Map<String, String> request) {
        try {
            // Verificar que el usuario esté autenticado
            Usuario usuario = authHelper.verificarToken(token, Usuario.Rol.PACIENTE, Usuario.Rol.ADMIN);
            
            String message = request.get("message");
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Mensaje requerido\"}");
            }

            String response = chatbotService.processMessage(message);
            
            return ResponseEntity.ok().body(Map.of(
                "response", response,
                "userRole", usuario.getRol().toString(),
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            throw new RuntimeException("Error en el chatbot: " + e.getMessage());
        }
    }

    @GetMapping("/topics")
    public ResponseEntity<?> getAvailableTopics(@RequestHeader("Authorization") String token) {
        try {
            authHelper.verificarToken(token, Usuario.Rol.PACIENTE, Usuario.Rol.ADMIN);
            Map<String, String> topics = chatbotService.getAvailableTopics();
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener temas: " + e.getMessage());
        }
    }

    @GetMapping("/help")
    public ResponseEntity<?> getHelp(@RequestHeader("Authorization") String token) {
        try {
            authHelper.verificarToken(token, Usuario.Rol.PACIENTE, Usuario.Rol.ADMIN);
            
            String helpText = "🤖 Asistente Virtual del Hospital\n\n" +
                            "Puedes preguntarme sobre:\n" +
                            "• Cómo agendar citas médicas\n" +
                            "• Cómo cancelar citas\n" +
                            "• Consultar tu historial médico\n" +
                            "• Información sobre medicamentos\n" +
                            "• Qué hacer en emergencias\n" +
                            "• Horarios de atención\n" +
                            "• Especialistas disponibles\n" +
                            "• Resultados de exámenes\n" +
                            "• Costos y precios\n" +
                            "• Datos de contacto\n\n" +
                            "Solo escribe tu pregunta de forma natural y te ayudaré.";
            
            return ResponseEntity.ok().body(Map.of("help", helpText));
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener ayuda: " + e.getMessage());
        }
    }
}
