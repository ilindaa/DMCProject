using DMCProject.Server;
/*using MySql.Data.MySqlClient;

ConnectionTest test = new ConnectionTest();
MySqlConnection conn = test.ConnectDB();*/

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("https://localhost:7035/")
                          .AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
   name: "Account",
   pattern: "/api/{controller=Account}/{action=Register}/{id?}");
app.MapControllerRoute(
    name: "default",
    pattern: "/api/{controller=Account}/{action=Index}/{id?}");

app.MapFallbackToFile("/index.html");

app.Run();

/* Closing the connection */
/*test.CloseDB(conn);*/
