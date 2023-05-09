using Microsoft.AspNetCore.SignalR;

namespace BlazorApp.Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task JoinRoom(string user, string roomName,string offer)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Group(roomName).SendAsync("ReceiveJoinMessage", user, offer, $"{user} Join");
        }

        public async Task JoinAnswer(string user, string roomName, string answer)
        {
            await Clients.Group(roomName).SendAsync("ReceiveAnswer", user, answer, $"{user} Get Answer");
        }
    }
}
