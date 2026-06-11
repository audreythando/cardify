using Azure;
using Azure.AI.OpenAI;
using OpenAI.Chat;

namespace Cardify.Api.Services;

public class AzureOpenAiService
{
    private readonly IConfiguration _configuration;

    public AzureOpenAiService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<string> GenerateFinancialInsightAsync(string prompt)
    {
        var endpoint = _configuration["AzureOpenAI:Endpoint"];
        var apiKey = _configuration["AzureOpenAI:ApiKey"];
        var deploymentName = _configuration["AzureOpenAI:DeploymentName"];

        if (string.IsNullOrWhiteSpace(endpoint) ||
            string.IsNullOrWhiteSpace(apiKey) ||
            string.IsNullOrWhiteSpace(deploymentName))
        {
            return "Azure OpenAI is not configured yet.";
        }

        var client = new AzureOpenAIClient(
            new Uri(endpoint),
            new AzureKeyCredential(apiKey)
        );

        var chatClient = client.GetChatClient(deploymentName);

        var response = await chatClient.CompleteChatAsync(
            new SystemChatMessage("You are a helpful financial assistant for a credit card management app called Cardify."),
            new UserChatMessage(prompt)
        );

        return response.Value.Content[0].Text;
    }
}