using System;
using Microsoft.AspNetCore.SignalR;

namespace BlazorApp.Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task JoinRoom(string user, string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Group(roomName).SendAsync("ReceiveJoinMessage", user, $"{user} Join");
        }

        public async Task SendOffer(string user, string roomName, string offer)
        {
            await Clients.Group(roomName).SendAsync("ReceiveOfferMessage", user, offer, $"{user} Send Offer");
        }

        public async Task SendAnswer(string user, string roomName, string answer)
        {
            await Clients.Group(roomName).SendAsync("ReceiveAnswerMessage", user, answer, $"{user} Send Answer");
        }
    }
}
