using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DMCProject.Server.Controllers
{
    [EnableCors("_myAllowSpecificOrigins")]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller {
        [ApiExplorerSettings(IgnoreApi = true)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("Register")]
        public void Register([FromBody] JsonElement jsonData)
        {
            if (jsonData.ValueKind == JsonValueKind.Object) {
                System.Diagnostics.Debug.WriteLine("Object");
                System.Diagnostics.Debug.WriteLine(jsonData);
                JObject jo = JsonConvert.DeserializeObject<JObject>(jsonData.GetRawText());
                string email = jo["email"].ToString();
                string password = jo["password"].ToString();
                string confirmPassword = jo["confirmPassword"].ToString();
                System.Diagnostics.Debug.WriteLine(jo);
                System.Diagnostics.Debug.WriteLine(email);
                System.Diagnostics.Debug.WriteLine(password);
                System.Diagnostics.Debug.WriteLine(confirmPassword);
            }
        }

        [HttpPost]
        [Route("Login")]
        public void Login([FromBody] JsonElement jsonData)
        {
            if (jsonData.ValueKind == JsonValueKind.Object)
            {
                System.Diagnostics.Debug.WriteLine("Object");
                System.Diagnostics.Debug.WriteLine(jsonData);
                JObject jo = JsonConvert.DeserializeObject<JObject>(jsonData.GetRawText());
                string email = jo["email"].ToString();
                string password = jo["password"].ToString();
                System.Diagnostics.Debug.WriteLine(jo);
                System.Diagnostics.Debug.WriteLine(email);
                System.Diagnostics.Debug.WriteLine(password);
            }
        }
    }
}
