using DMCProject.Server;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Handle CORS here
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

// Add distributed memory cache for session
builder.Services.AddDistributedMemoryCache();

// Configure session options
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(2); // Set session timeout (2 minutes)
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
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

// UseCors() has to be in between UseRouting() and UseAuthorization()
app.UseCors(MyAllowSpecificOrigins);

// UseSession() has to be after UseRouting() and before mapping
app.UseSession();

app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
   name: "Account",
   pattern: "/api/{controller=Account}/{action=Register}/{id?}");
app.MapControllerRoute(
   name: "Login",
   pattern: "/api/{controller=Account}/{action=Login}/{id?}");
app.MapControllerRoute(
    name: "default",
    pattern: "/api/{controller=Account}/{action=Index}/{id?}");

app.MapFallbackToFile("/index.html");

app.Run();
