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
    public class AccountController : SessionController {

        [ApiExplorerSettings(IgnoreApi = true)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("SignUp")]
        public IActionResult SignUp([FromBody] JsonElement jsonData)
        {
            string msg = "";
            if (jsonData.ValueKind == JsonValueKind.Object)
            {
                System.Diagnostics.Debug.WriteLine(jsonData);
                JObject jo = JsonConvert.DeserializeObject<JObject>(jsonData.GetRawText());
                string email = jo["email"].ToString();
                string password = jo["password"].ToString();
                string confirmPassword = jo["confirmPassword"].ToString();

                ConnectionTest test = new ConnectionTest();
                MySqlConnection conn = test.ConnectDB();
                MySqlCommand cmd = conn.CreateCommand();
                // Check if an account with the email exists before signing up
                cmd.CommandText = "SELECT * FROM Account WHERE Email=@value1";
                cmd.Parameters.AddWithValue("@value1", email);
                // ExecuteScalar returns a single value (result)
                object result = cmd.ExecuteScalar();
                if (result != null)
                {
                    msg = "Error: An account with this email already exists! Please log into your account.";
                }
                else
                {
                    // An account with the email does not exist so sign up the account
                    cmd.CommandText = "INSERT INTO Account (Email, Password) VALUES (@value1, @value2)";
                    // Add parameters with their values (protects against SQL injection)
                    cmd.Parameters.AddWithValue("@value2", password);
                    cmd.ExecuteNonQuery();
                    msg = "Signed up!";
                }
                test.CloseDB(conn);
            }
            return Ok(msg);
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login([FromBody] JsonElement jsonData)
        {
            string msg = "";
            if (jsonData.ValueKind == JsonValueKind.Object)
            {
                System.Diagnostics.Debug.WriteLine(jsonData);
                JObject jo = JsonConvert.DeserializeObject<JObject>(jsonData.GetRawText());
                string email = jo["email"].ToString();
                string password = jo["password"].ToString();

                ConnectionTest test = new ConnectionTest();
                MySqlConnection conn = test.ConnectDB();
                MySqlCommand cmd = conn.CreateCommand();
                // Check if the email and the password exists in Account
                cmd.CommandText = "SELECT * FROM Account WHERE Email=@value1 AND Password=@value2";
                cmd.Parameters.AddWithValue("@value1", email);
                cmd.Parameters.AddWithValue("@value2", password);
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.Read())
                {
                    setSession(rdr);
                    msg = "Logged in!";
                } else
                {
                    msg = "Error: The account does not exist or the password you inputted was incorrect!";
                }
                test.CloseDB(conn);
            }
            return Ok(msg);
        }
    }
}
