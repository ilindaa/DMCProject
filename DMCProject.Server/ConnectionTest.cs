using MySql.Data.MySqlClient;

namespace DMCProject.Server
{
    public class ConnectionTest { 
        public MySqlConnection ConnectDB() {

            DotNetEnv.Env.Load();

            var serverValue = Environment.GetEnvironmentVariable("SERVER");
            var uidValue = Environment.GetEnvironmentVariable("UID");
            var pwdValue = Environment.GetEnvironmentVariable("PWD");
            var databaseValue = Environment.GetEnvironmentVariable("DATABASE");

            string connStr = $"server={serverValue};uid={uidValue};pwd={pwdValue};database={databaseValue}";
            MySqlConnection conn = new MySqlConnection(connStr);

            try {
                System.Diagnostics.Debug.WriteLine("Connecting to MySQL...");
                conn.Open();
                System.Diagnostics.Debug.WriteLine("Connected!");
            } catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("ERROR: " + ex.ToString());
            }

            return conn;
        }

        public void CloseDB(MySqlConnection conn) {
            conn.Close();
            System.Diagnostics.Debug.WriteLine("Connection closed!");
        }
    }
}
