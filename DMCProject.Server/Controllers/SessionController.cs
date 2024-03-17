using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.Json;

namespace DMCProject.Server.Controllers
{
    [EnableCors("_myAllowSpecificOrigins")]
    [ApiController]
    [Route("api/[controller]")]
    public class SessionController : Controller {
        private const string SessionLogin = "_Login"; // Is the user logged in (1) or not (0)?
        private const string SessionId = "_Id"; // AccountID
        private const string SessionAdmin = "_Admin"; // Is the account an admin (1) or user (0)?

        [ApiExplorerSettings(IgnoreApi = true)]
        public ActionResult Index()
        {
            return View();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public void setSession(MySqlDataReader rdr)
        {
            HttpContext.Session.SetInt32(SessionLogin, 1);
            HttpContext.Session.SetInt32(SessionId, Convert.ToInt32(rdr["AccountID"]));
            HttpContext.Session.SetInt32(SessionAdmin, Convert.ToInt32(rdr["Admin"]));
            System.Diagnostics.Debug.WriteLine(rdr["AccountID"]);
            System.Diagnostics.Debug.WriteLine(rdr["Admin"]);

            System.Diagnostics.Debug.WriteLine("SessionLogin: " + getSessionLogin());
            System.Diagnostics.Debug.WriteLine("SessionId: " + getSessionId());
            System.Diagnostics.Debug.WriteLine("SessionAdmin: " + getSessionAdmin());
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public int? getSessionLogin()
        {
            return HttpContext.Session.GetInt32(SessionLogin);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public int? getSessionId()
        {
            return HttpContext.Session.GetInt32(SessionId);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public int? getSessionAdmin()
        {
            return HttpContext.Session.GetInt32(SessionAdmin);
        }
    }
}
