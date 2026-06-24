namespace Cardify.Api.Services;

public interface IAiService
{
    Task<string> GenerateFinancialInsightAsync(string prompt);
    Task<string> GenerateCardifyAdviceAsync(string financialContext, string question);
    
}