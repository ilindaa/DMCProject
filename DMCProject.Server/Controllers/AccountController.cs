using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Printing;

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
        public void Register()
        {
            System.Diagnostics.Debug.WriteLine("Test");
        }

        /*      public void Login()
                {
                    string email = HttpContext.Request.Query["email"].ToString();
                    string password = HttpContext.Request.Query["password"].ToString();
                    System.Diagnostics.Debug.WriteLine(email);
                    System.Diagnostics.Debug.WriteLine(password);
                }*/
    }
}
