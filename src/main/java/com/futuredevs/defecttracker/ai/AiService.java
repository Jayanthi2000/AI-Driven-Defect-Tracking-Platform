package com.futuredevs.defecttracker.ai;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiService {

    @Value("${openai.api.key}")
    private String apiKey;

    public String analyzeBug(String description) {
        OpenAiService service = new OpenAiService(apiKey);

        String prompt = "Analyze this bug description and respond in this exact format:\n" +
                "SEVERITY: (CRITICAL/HIGH/MEDIUM/LOW)\n" +
                "CATEGORY: (UI/API/DATABASE/AUTHENTICATION/PERFORMANCE/OTHER)\n" +
                "SUGGESTION: (one line fix suggestion)\n\n" +
                "Bug Description: " + description;

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(new ChatMessage("user", prompt)))
                .maxTokens(200)
                .build();

        return service.createChatCompletion(request)
                .getChoices().get(0).getMessage().getContent();
    }
}