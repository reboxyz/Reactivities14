using System.Net;
using System.Text.Json;
using Application.Errors;

namespace API.Middleware;

public class ErroHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErroHandlingMiddleware> _logger;

    public ErroHandlingMiddleware(RequestDelegate next, ILogger<ErroHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        object? errors = null;

        switch (ex)
        {
            case RestException re:
                _logger.LogError(ex, "REST ERROR");
                errors = re.Errors;
                context.Response.StatusCode = (int)re.Code;
                break;
            case Exception e:
                _logger.LogError(ex, "SERVER ERROR");
                errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }

        context.Response.ContentType = "application/json";

        if (errors is not null)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(new
            {
                errors
            }, options);

            await context.Response.WriteAsync(json);
        }
    }
}
