﻿using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
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
    public class AccountController : Controller {
        private const string SessionLogin = "_Login"; // Is the user logged in (1) or not (0)?
        private const string SessionId = "_Id"; // AccountID
        private const string SessionAdmin = "_Admin"; // Is the account an admin (1) or employee (0)?

        [ApiExplorerSettings(IgnoreApi = true)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("Register")]
        public void Register([FromBody] JsonElement jsonData)
        {
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
                // Check if an account with the email exists before registering
                cmd.CommandText = "SELECT * FROM Account WHERE Email=@value1";
                cmd.Parameters.AddWithValue("@value1", email);
                // ExecuteScalar returns a single value (result)
                object result = cmd.ExecuteScalar();
                if (result != null)
                {
                    System.Diagnostics.Debug.WriteLine("Error: An account with this email already exists! Please log into your account.");
                }
                else
                {
                    // An account with the email does not exist so register the account
                    cmd.CommandText = "INSERT INTO Account (Email, Password) VALUES (@value2, @value3)";
                    // Add parameters with their values (protects against SQL injection)
                    cmd.Parameters.AddWithValue("@value2", email);
                    cmd.Parameters.AddWithValue("@value3", password);
                    cmd.ExecuteNonQuery();
                    System.Diagnostics.Debug.WriteLine("Registered!");
                }
                test.CloseDB(conn);
            }
        }

        [HttpPost]
        [Route("Login")]
        public void Login([FromBody] JsonElement jsonData)
        {
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
                    HttpContext.Session.SetInt32(SessionLogin, 1);
                    HttpContext.Session.SetInt32(SessionId, Convert.ToInt32(rdr["AccountID"]));
                    HttpContext.Session.SetInt32(SessionAdmin, Convert.ToInt32(rdr["Admin"]));
                    System.Diagnostics.Debug.WriteLine(rdr["AccountID"]);
                    System.Diagnostics.Debug.WriteLine(rdr["Admin"]);
                    System.Diagnostics.Debug.WriteLine("Logged in!");
                    System.Diagnostics.Debug.WriteLine("SessionLogin: " + HttpContext.Session.GetInt32(SessionLogin));
                    System.Diagnostics.Debug.WriteLine("SessionId: " + HttpContext.Session.GetInt32(SessionId));
                    System.Diagnostics.Debug.WriteLine("SessionAdmin: " + HttpContext.Session.GetInt32(SessionAdmin));
                } else
                {
                    System.Diagnostics.Debug.WriteLine("Error: The account does not exist or the password you inputted is incorrect!");
                }
                test.CloseDB(conn);
            }
        }
    }
}
