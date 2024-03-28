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
    public class UserRefContentController : SessionController
    {

        [ApiExplorerSettings(IgnoreApi = true)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("AddURContent")]
        public IActionResult AddURContent([FromBody] JsonElement jsonData)
        {
            string msg = "";
            if (jsonData.ValueKind == JsonValueKind.Object)
            {
                try
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

                    System.Diagnostics.Debug.WriteLine(firstName);
                    System.Diagnostics.Debug.WriteLine(uploadImage);
                    string filePath = handleImage(uploadImage);

                    // Insert into the AddURContent table
                    cmd.CommandText = "INSERT INTO AddURContent (FirstName, MiddleName, LastName, FilePath, ImageCategory) VALUES (@value1, @value2, @value3, @value4, @value5)";
                    cmd.Parameters.AddWithValue("@value1", firstName);
                    cmd.Parameters.AddWithValue("@value2", middleName);
                    cmd.Parameters.AddWithValue("@value3", lastName);
                    cmd.Parameters.AddWithValue("@value4", filePath);
                    cmd.Parameters.AddWithValue("@value5", category);
                    cmd.ExecuteNonQuery();

                    // Select the last insert id
                    cmd.CommandText = "SELECT LAST_INSERT_ID()";
                    int lastInsertId = Convert.ToInt32(cmd.ExecuteScalar());

                    /*                int sessionId = -1;*/
                    // Insert into the ReviewURContent table
                    cmd.CommandText = "INSERT INTO ReviewURContent (AddURContentID) VALUES (@value6)";
                    /*                cmd.CommandText = "INSERT INTO ReviewURContent (AddURContentID, AccountID) VALUES (@value6, @value7)";*/
                    cmd.Parameters.AddWithValue("@value6", lastInsertId);
                    /*                cmd.Parameters.AddWithValue("@value7", sessionId);*/
                    cmd.ExecuteNonQuery();

                    msg = "Submitted for review!";
                    System.Diagnostics.Debug.WriteLine(msg);

                    test.CloseDB(conn);
                }
                catch (Exception error)
                {
                    System.Diagnostics.Debug.WriteLine(error);
                }
            }
            return Ok(msg);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public String handleImage(string dataUrl)
        {
            string filePath = "";
            try
            {
                // Split the dataUrl to get the base64
                string base64Str = dataUrl.Split(",").Last();

                // Convert the base64 string to a byte array
                byte[] bytes = Convert.FromBase64String(base64Str);

                filePath = Path.Combine("customPictures", Guid.NewGuid().ToString() + ".png");

                // Write the byte array to a filePath
                System.IO.File.WriteAllBytes(filePath, bytes);
                System.Diagnostics.Debug.WriteLine("Image saved to " + filePath);
            }
            catch (Exception error)
            {
                System.Diagnostics.Debug.WriteLine(error);
            }

            return filePath;
        }

        [HttpGet]
        [Route("GetAddURContent")]
        public IActionResult GetAddURContent()
        {
            ConnectionTest test = new ConnectionTest();
            MySqlConnection conn = test.ConnectDB();
            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = "SELECT * FROM AddURContent";
            MySqlDataReader rdr = cmd.ExecuteReader();

            List<MyData> dataList = new List<MyData>();

            while (rdr.Read())
            {
                MyData data = new MyData();
                data.addURContentID = Convert.ToInt32(rdr["AddURContentID"]);
                data.firstName = rdr["FirstName"].ToString();
                data.middleName = rdr["MiddleName"].ToString();
                data.lastName = rdr["LastName"].ToString();
                data.filePath = rdr["FilePath"].ToString();
                data.imageCategory = rdr["ImageCategory"].ToString();
                dataList.Add(data);
            }

            test.CloseDB(conn);

            string json = JsonConvert.SerializeObject(dataList);

            return Content(json, "application/json");
        }

        [HttpPost]
        [Route("DeleteURContent")]
        public void DeleteURContent([FromBody] JsonElement jsonData)
        {
            int id = Convert.ToInt32(System.Text.Json.JsonSerializer.Deserialize<string>(jsonData));

            ConnectionTest test = new ConnectionTest();
            MySqlConnection conn = test.ConnectDB();
            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = "SELECT * FROM AddURContent WHERE AddURContentID=@value1";
            cmd.Parameters.AddWithValue("@value1", id);
            MySqlDataReader rdr = cmd.ExecuteReader();
            if (rdr.Read())
            {
                rdr.Close();
                cmd.CommandText = "DELETE FROM ReviewURContent WHERE AddURContentID=@value1";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "DELETE FROM AddURContent WHERE AddURContentID=@value1";
                cmd.ExecuteNonQuery();
                System.Diagnostics.Debug.WriteLine("Deleted row " + id + " from ReviewURContent and AddURContent tables!");
            } else
            {
                System.Diagnostics.Debug.WriteLine("Error: The AddURContentID " + id + " doesn't exist!");
            }

            test.CloseDB(conn);
        }
    }

    public class MyData
    {
        public int addURContentID;
        public string firstName;
        public string middleName;
        public string lastName;
        public string filePath;
        public string imageCategory;
    }
}
