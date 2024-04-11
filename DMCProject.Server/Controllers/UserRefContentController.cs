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
        public String handleImage(string dataUrl, string filePath = "")
        {
            try
            {
                // Split the dataUrl to get the base64
                string base64Str = dataUrl.Split(",").Last();

                // Convert the base64 string to a byte array
                byte[] bytes = Convert.FromBase64String(base64Str);

                // If the filePath is the default parameter, create a new filePath; otherwise overwrite the existing filePath
                if (filePath == "")
                {
                    filePath = Path.Combine("wwwroot/References", Guid.NewGuid().ToString() + ".png");
                }

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

        [HttpGet]
        [Route("GetReviewURContent")]
        public IActionResult GetReviewURContent()
        {
            ConnectionTest test = new ConnectionTest();
            MySqlConnection conn = test.ConnectDB();
            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = "SELECT ReviewURContent.ReviewURContentID, ReviewURContent.Review, AddURContent.* FROM ReviewURContent JOIN AddURContent USING(AddURContentID)";
            MySqlDataReader rdr = cmd.ExecuteReader();

            List<MyDataTwo> dataList = new List<MyDataTwo>();

            while (rdr.Read())
            {
                MyDataTwo data = new MyDataTwo();
                data.reviewURContentID = Convert.ToInt32(rdr["reviewURContentID"]);
                data.review = Convert.ToInt32(rdr["review"]);
                data.addURContentID = Convert.ToInt32(rdr["AddURContentID"]);
                data.firstName = rdr["FirstName"].ToString();
                data.middleName = rdr["MiddleName"].ToString();
                data.lastName = rdr["LastName"].ToString();
                data.filePath = rdr["FilePath"].ToString();
                data.imageCategory = rdr["ImageCategory"].ToString();
                dataList.Add(data);
            }

            System.Diagnostics.Debug.WriteLine(dataList);

            test.CloseDB(conn);

            string json = JsonConvert.SerializeObject(dataList);

            return Content(json, "application/json");
        }

        // Add IActionResult?
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
            // Figure out how to delete the filepath later of the image (another command here to get the filePath) and then do File.Delete(filePath)
            MySqlDataReader rdr = cmd.ExecuteReader();
            if (rdr.Read())
            {
                rdr.Close();

                cmd.CommandText = "SELECT FilePath FROM AddURContent WHERE AddURContentID=@value1";
                string relPath = cmd.ExecuteScalar().ToString();
                System.Diagnostics.Debug.WriteLine("filePath: " + relPath);
                string currentPath = Directory.GetCurrentDirectory().ToString();
                string filePath = Path.Combine(currentPath, relPath);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    System.Diagnostics.Debug.WriteLine("Image on relative path is deleted: " + relPath + "!");
                }

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

        [HttpPost]
        [Route("EditURContent")]
        public IActionResult EditURContent([FromBody] JsonElement jsonData)
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
                    int id = Convert.ToInt32(jo["addUrContentId"]);
                    string keepFilePath = jo["filePath"].ToString();

                    ConnectionTest test = new ConnectionTest();
                    MySqlConnection conn = test.ConnectDB();
                    MySqlCommand cmd = conn.CreateCommand();

                    System.Diagnostics.Debug.WriteLine(firstName);
                    System.Diagnostics.Debug.WriteLine(uploadImage);
                    string filePath = handleImage(uploadImage, keepFilePath);

                    // Edit (update) the AddURContent table
                    cmd.CommandText = "UPDATE AddURContent SET FirstName=@value1, MiddleName=@value2, LastName=@value3, FilePath=@value4, ImageCategory=@value5 WHERE AddURContentID=@value6";
                    cmd.Parameters.AddWithValue("@value1", firstName);
                    cmd.Parameters.AddWithValue("@value2", middleName);
                    cmd.Parameters.AddWithValue("@value3", lastName);
                    cmd.Parameters.AddWithValue("@value4", filePath);
                    cmd.Parameters.AddWithValue("@value5", category);
                    cmd.Parameters.AddWithValue("@value6", id);
                    cmd.ExecuteNonQuery();

                    msg = "AddURContent table was updated for " + id + "!";
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

        // Add IActionResult?
        [HttpPost]
        [Route("ReviewURContent")]
        public void ReviewURContent([FromBody] JsonElement jsonData)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine(jsonData);
                JObject jo = JsonConvert.DeserializeObject<JObject>(jsonData.GetRawText());
                int id = Convert.ToInt32(jo["reviewUrContentId"]);
                int review = Convert.ToInt32(jo["review"]);

                System.Diagnostics.Debug.WriteLine("Id: " + id);
                System.Diagnostics.Debug.WriteLine("Review: " + review);

                ConnectionTest test = new ConnectionTest();
                MySqlConnection conn = test.ConnectDB();
                MySqlCommand cmd = conn.CreateCommand();

                cmd.CommandText = "UPDATE ReviewURContent SET Review=@value1 WHERE ReviewURContentID=@value2";
                cmd.Parameters.AddWithValue("@value1", review);
                cmd.Parameters.AddWithValue("@value2", id);
                cmd.ExecuteNonQuery();

                System.Diagnostics.Debug.WriteLine("ReviewURContent table was updated for " + id + "!");
                test.CloseDB(conn);
            } catch (Exception error)
            {
                System.Diagnostics.Debug.WriteLine(error);
            }
        }

        [HttpPost]
        [Route("ImageContent")]
        public IActionResult ImageContent([FromBody] JsonElement jsonData)
        {
            var json = "";
            if (jsonData.ValueKind == JsonValueKind.Object)
            {
                try
                {
                    System.Diagnostics.Debug.WriteLine(jsonData);
                    JObject jo = JsonConvert.DeserializeObject<JObject>(jsonData.GetRawText());
                    string category = jo["category"].ToString();
                    System.Diagnostics.Debug.WriteLine(category);

                    ConnectionTest test = new ConnectionTest();
                    MySqlConnection conn = test.ConnectDB();
                    MySqlCommand cmd = conn.CreateCommand();

                    cmd.CommandText = "SELECT AddURContent.FirstName, AddURContent.MiddleName, AddURContent.LastName, AddURContent.FilePath FROM AddURContent INNER JOIN ReviewURContent ON AddURContent.AddURContentID = ReviewURContent.AddURContentID WHERE ReviewURContent.Review=@value1 AND AddURContent.ImageCategory=@value2";
                    cmd.Parameters.AddWithValue("@value1", 1);
                    cmd.Parameters.AddWithValue("@value2", category);
                    MySqlDataReader rdr = cmd.ExecuteReader();

                    List<MyDataThree> dataList = new List<MyDataThree>();

                    while (rdr.Read())
                    {
                        MyDataThree data = new MyDataThree();
                        data.firstName = rdr["FirstName"].ToString();
                        data.middleName = rdr["MiddleName"].ToString();
                        data.lastName = rdr["LastName"].ToString();
                        data.filePath = rdr["FilePath"].ToString();
                        dataList.Add(data);
                        System.Diagnostics.Debug.WriteLine("dataList: " + dataList);
                    }

                    test.CloseDB(conn);

                    json = JsonConvert.SerializeObject(dataList);
                    System.Diagnostics.Debug.WriteLine("Json: " + json);
                }
                catch (Exception error)
                {
                    System.Diagnostics.Debug.WriteLine(error);
                }
            }

            return Content(json, "application/json");
        }

        // End
    }

    // Other classes
    public class MyData
    {
        public int addURContentID;
        public string firstName;
        public string middleName;
        public string lastName;
        public string filePath;
        public string imageCategory;
    }

    public class MyDataTwo
    {
        public int reviewURContentID;
        public int review;
        public int addURContentID;
        public string firstName;
        public string middleName;
        public string lastName;
        public string filePath;
        public string imageCategory;
    }

    public class MyDataThree
    {
        public string firstName;
        public string middleName;
        public string lastName;
        public string filePath;
    }
}
