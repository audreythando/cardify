using Cardify.Api.DTOs.Ai;
using Cardify.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cardify.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly AzureOpenAiService _azureOpenAiService;

    public AiController(AzureOpenAiService azureOpenAiService)
    {
        _azureOpenAiService = azureOpenAiService;
    }

    [HttpPost("financial-insight")]
    public async Task<IActionResult> GenerateFinancialInsight(AiFinancialInsightRequest request)
    {
        var insight = await _azureOpenAiService.GenerateFinancialInsightAsync(request.Prompt);

        return Ok(new
        {
            insight
        });
    }
}