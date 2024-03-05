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
    public class UserRefContentController : Controller {

        [ApiExplorerSettings(IgnoreApi = true)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("AddURContent")]
        public void AddURContent([FromBody] JsonElement jsonData)
        {
            if(jsonData.ValueKind == JsonValueKind.Object)
            {
                System.Diagnostics.Debug.WriteLine(jsonData);
                JObject jo = JsonConvert.DeserializeObject<JObject>(jsonData.GetRawText());
                string firstName = jo["firstName"].ToString();
                string middleName = jo["middleName"].ToString();
                string lastName = jo["lastName"].ToString();
                string uploadImage = jo["uploadImage"].ToString();
                string category = jo["category"].ToString();

                ConnectionTest test = new ConnectionTest();
                MySqlConnection conn = test.ConnectDB();
                MySqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "INSERT INTO AddURContent (FirstName, MiddleName, LastName, ImagePath, ImageCategory) VALUES (@value1, @value2, @value3, @value4, @value5)";
                cmd.Parameters.AddWithValue("@value1", firstName);
                cmd.Parameters.AddWithValue("@value2", middleName);
                cmd.Parameters.AddWithValue("@value3", lastName);
                cmd.Parameters.AddWithValue("@value4", category);
                cmd.ExecuteNonQuery();
                test.CloseDB(conn);
            }
        }
    }
}
