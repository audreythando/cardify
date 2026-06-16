using System.Text;
using System.Text.Json;

namespace Cardify.Api.Services;

public class OllamaService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public OllamaService(HttpClient httpClient, IConfiguration configuration)
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
        var model = _configuration["Ollama:Model"] ?? "phi3";
        var baseUrl = _configuration["Ollama:BaseUrl"] ?? "http://localhost:11434";

        var requestBody = new
        {
            model,
            prompt = $"""
            You are Cardify AI, a personal finance assistant inside a credit card management app.

            Use ONLY the user's Cardify financial data below. Do not give generic advice unless it is clearly connected to the data.

            Rules:
            - Use South African Rand (ZAR).
            - Be specific and practical.
            - Mention exact categories, amounts, budgets, or utilisation where possible.
            - Keep the response concise.
            - Use bullet points if helpful.
            - Do not pretend to know data that is not provided.

            User Cardify Financial Data:
            {financialContext}

            User Question:
            {question}
            """,
            stream = false,
            keep_alive = "30m",
            options = new
            {
                num_predict = 350,
                temperature = 0.4
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync($"{baseUrl}/api/generate", content);

            if (!response.IsSuccessStatusCode)
            {
                return "Ollama is not responding. Make sure Ollama is running locally.";
            }

            var responseJson = await response.Content.ReadAsStringAsync();

            using var document = JsonDocument.Parse(responseJson);

            var aiResponse = document.RootElement
                .GetProperty("response")
                .GetString();

            return aiResponse ?? "I could not generate advice right now.";
        }
        catch (TaskCanceledException)
        {
            return "Cardify AI took too long to respond. The model may still be loading — please try again.";
        }
    }

    // Fire-and-forget on startup to load the model into memory before the first real request.
    public async Task WarmUpAsync()
    {
        var model = _configuration["Ollama:Model"] ?? "phi3";
        var baseUrl = _configuration["Ollama:BaseUrl"] ?? "http://localhost:11434";

        var requestBody = new
        {
            model,
            prompt = "ok",
            stream = false,
            keep_alive = "30m"
        };

        var content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        try
        {
            await _httpClient.PostAsync($"{baseUrl}/api/generate", content);
        }
        catch
        {
       
        }
    }
}