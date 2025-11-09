
using flappyBirb_server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using flappyBirb_server.Data;

namespace flappyBirb_server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            
            builder.Services.AddDbContext<flappyBirb_serverContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("flappyBirb_serverContext") ?? throw new InvalidOperationException("Connection string 'flappyBirb_serverContext' not found.")));

            builder.Services.AddIdentity<User, IdentityRole>().AddEntityFrameworkStores<flappyBirb_serverContext>(); // Et ceci

            builder.Services.AddAuthentication(options =>
            {
                // Indiquer � ASP.NET Core que nous proc�derons � l'authentification par le biais d'un JWT
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {

                options.SaveToken = true; // Sauvegarder les tokens c�t� serveur pour pouvoir valider leur authenticit�
                options.RequireHttpsMetadata = false; // Lors du d�veloppement on peut laisser � false
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidAudience = "http://localhost:4200", // Audience : Client
                    ValidIssuer = "https://localhost:7249", // Issuer : Serveur -> HTTPS V�RIFIEZ le PORT de votre serveur dans launchsettings.json !
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                        .GetBytes("LooOOongue Phrase SiNoN �a ne Marchera PaAaAAAaAas !")) // Cl� pour d�chiffrer les tokens
                };
            });

            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 1;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyHeader();
                    policy.AllowAnyMethod();
                    policy.AllowAnyOrigin();
                });
            });

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowAll");

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
