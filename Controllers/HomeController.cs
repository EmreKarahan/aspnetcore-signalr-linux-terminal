using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.Extensions.Options;
using terminalApp.Hubs;

namespace terminalApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHubContext _hub;
        private AppConfiguration _configuration { get; set; }
        private IHostingEnvironment _environment;

        public HomeController(IConnectionManager connectionManager, IHostingEnvironment environment, IOptions<AppConfiguration> configuration)
        {
            _environment = environment;
            _configuration = configuration.Value;
            _hub = connectionManager.GetHubContext<TerminalHub>();
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
