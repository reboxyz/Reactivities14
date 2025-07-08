namespace Application.Errors;

public class CustomApplicationException: Exception
{
    public CustomApplicationException() : base() { }

    public CustomApplicationException(string message) : base(message) { }

    public CustomApplicationException(string message, Exception innerException) : base(message, innerException) { }
}
