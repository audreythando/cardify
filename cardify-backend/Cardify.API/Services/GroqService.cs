using System.Text;
using System.Text.Json;

namespace Cardify.Api.Services;

public class GroqService : IAiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GroqService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GenerateFinancialInsightAsync(string prompt)
    {
        return await GenerateCardifyAdviceAsync("", prompt);
    }

    public async Task<string> GenerateCardifyAdviceAsync(string financialContext, string question)
    {
        var apiKey = _configuration["Groq:ApiKey"];
        var model = _configuration["Groq:Model"] ?? "llama-3.3-70b-versatile";
        var baseUrl = _configuration["Groq:BaseUrl"] ?? "https://api.groq.com/openai/v1";

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return "AI is not configured. The Groq API key is missing.";
        }

        var systemPrompt = """
        You are Cardify AI, a personal finance assistant inside a credit card management app.
        Use ONLY the user's Cardify financial data provided. Do not give generic advice unless clearly connected to the data.
        Rules:
        - Use South African Rand (ZAR).
        - Be specific and practical; mention exact categories, amounts, budgets, or utilisation where possible.
        - Keep the response concise. Use bullet points if helpful.
        - Do not pretend to know data that is not provided.
        """;

        var userContent = string.IsNullOrWhiteSpace(financialContext)
            ? question
            : $"User Cardify Financial Data:\n{financialContext}\n\nUser Question:\n{question}";

        var requestBody = new
        {
            model,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userContent }
            },
            temperature = 0.4,
            max_tokens = 500
        };

        var json = JsonSerializer.Serialize(requestBody);
        using var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/chat/completions")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        request.Headers.Add("Authorization", $"Bearer {apiKey}");

        try
        {
            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                return "Cardify AI is unavailable right now. Please try again shortly.";
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(responseJson);

            var content = document.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return content ?? "I couldn't generate advice right now.";
        }
        catch (TaskCanceledException)
        {
            return "Cardify AI took too long to respond. Please try again.";
        }
    }
}