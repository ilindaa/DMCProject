using System;
using System.Data;
using System.Media;
using MySql.Data;
using MySql.Data.MySqlClient;
using DotNetEnv;

namespace DMCProject.Server
{
    public class Testing { 
        public void Main() {

            DotNetEnv.Env.Load();

            var serverValue = Environment.GetEnvironmentVariable("SERVER");
            var uidValue = Environment.GetEnvironmentVariable("UID");
            var pwdValue = Environment.GetEnvironmentVariable("PWD");
            var databaseValue = Environment.GetEnvironmentVariable("DATABASE");

            string connStr = $"server={serverValue};uid={uidValue};pwd={pwdValue};database={databaseValue}";
            MySqlConnection conn = new MySqlConnection(connStr);

            try {
/*                Console.WriteLine("Connecting to MySQL...");*/
                System.Diagnostics.Debug.WriteLine("Connecting to MySQL...");
                conn.Open();
                System.Diagnostics.Debug.WriteLine("Connected!");
            } catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("ERROR: " + ex.ToString());
/*                Console.WriteLine(ex.ToString());*/
            }
            conn.Close();
            Console.WriteLine("Done");
        }
    }
}
