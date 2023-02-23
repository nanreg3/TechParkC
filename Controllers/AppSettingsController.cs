using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using TechParkC.Model;

namespace TechParkC.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppSettingsController : ControllerBase
    {
        private readonly AppSettings appSettings;
        public AppSettingsController(IOptionsSnapshot<AppSettings> options)
        {
            appSettings = options.Value;
        }

        [HttpGet]
        public AppSettings Get()
        {
            return appSettings;            
        }
        
    }
}
