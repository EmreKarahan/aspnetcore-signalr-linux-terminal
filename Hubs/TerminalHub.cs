using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;
using Microsoft.DotNet.InternalAbstractions;
using terminalApp.Common;

namespace terminalApp.Hubs
{
    [HubName("terminalHub")]
    public class TerminalHub : Hub
    {

        //private static  Dictionary<string, ProcessStartHelper> _processDictionary = new Dictionary<string, ProcessStartHelper>();

        private ProcessStartHelper _process = new ProcessStartHelper();
        public TerminalHub()
        {
            //_processDictionary = 
            //_process = new ProcessStartHelper();
        }

        public void Receive(string cmd, string connID)
        {

            //var objectKey = $"obj_{connID}";

            _process.OutputDataReceived += (s, e) => Clients.Client(connID).message($"{e.Data}");
            _process.ErrorDataReceived += (s, e) => Clients.Client(connID).message($"{e.Data}");
            //_process.Exited += (s, e) => Clients.Client(connID).message($"Procees Finished...");
            _process.Error += (s, e) => Clients.Client(connID).message(e.ErrorMessage);

            _process.Execute(cmd);
        }

        public override System.Threading.Tasks.Task OnConnected()
        {

            //var objectKey = $"obj_{Context.ConnectionId}";

            // if (!_processDictionary.ContainsKey(objectKey))
            // {
            //     ProcessStartHelper process = new ProcessStartHelper();
            //     _processDictionary.Add(objectKey, process);
            // }

            StringBuilder greetings = new StringBuilder();
            greetings.Append(RuntimeEnvironment.OperatingSystemPlatform);
            greetings.Append($" {System.Environment.MachineName}");
            greetings.Append($" {RuntimeEnvironment.OperatingSystem} {RuntimeEnvironment.OperatingSystemVersion} {RuntimeEnvironment.RuntimeArchitecture}");
            greetings.Append($" {DateTime.Now}");


            WelcomeModel model = new WelcomeModel();
            model.MachineName = System.Environment.MachineName;
            model.Username = System.Environment.GetEnvironmentVariable("LOGNAME");
            model.CurrentDir = System.IO.Directory.GetCurrentDirectory();
            model.Greetings = greetings.ToString();


            Clients.Client(Context.ConnectionId).onConnect(model);

            return base.OnConnected();
        }
    }
}