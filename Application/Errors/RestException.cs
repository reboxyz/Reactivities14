using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Application.Errors;

public class RestException : Exception
{
    public RestException(HttpStatusCode code, object errors)
    {
        Code = code;
        Errors = errors;
    }

    public HttpStatusCode Code { get; }
    public object Errors { get; }
}
