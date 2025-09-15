using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);  // Note! "ReceiveComment" is the method in the client-side to be invoked
        }

        
        // When a client connects, send or load all comments to the connecting client
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext?.Request.Query["activityId"]; // Note! "activityId" must be present in URL Query string param
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId!);

            var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId!) });
            await Clients.Caller.SendAsync("LoadComments", result.Value); // Note! "LoadComments" is the method to be invoked on the client-side
        }
    }
}