﻿using Microsoft.AspNetCore.Cors;
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
        public IActionResult AddURContent([FromBody] JsonElement jsonData)
        {
            string msg = "";
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

                System.Diagnostics.Debug.WriteLine(firstName);
                System.Diagnostics.Debug.WriteLine(uploadImage);
                string filePath = handleImage(uploadImage);

                cmd.CommandText = "INSERT INTO AddURContent (FirstName, MiddleName, LastName, FilePath, ImageCategory) VALUES (@value1, @value2, @value3, @value4, @value5)";
                cmd.Parameters.AddWithValue("@value1", firstName);
                cmd.Parameters.AddWithValue("@value2", middleName);
                cmd.Parameters.AddWithValue("@value3", lastName);
                cmd.Parameters.AddWithValue("@value4", filePath);
                cmd.Parameters.AddWithValue("@value5", category);
                cmd.ExecuteNonQuery();

                msg = "Your submission was submitted for review!";
                System.Diagnostics.Debug.WriteLine(msg);

                test.CloseDB(conn);
            }
            return Ok(msg);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public String handleImage(string dataUrl)
        {
            // Split the dataUrl to get the base64
            string base64Str = dataUrl.Split(",").Last();

            // Convert the base64 string to a byte array
            byte[] bytes = Convert.FromBase64String(base64Str);

            string filePath = Path.Combine("customPictures", Guid.NewGuid().ToString() + ".png" );

            // Write the byte array to a filePath
            System.IO.File.WriteAllBytes(filePath, bytes);

            System.Diagnostics.Debug.WriteLine("Image saved to " + filePath);

            return filePath;
        }
    }
}
