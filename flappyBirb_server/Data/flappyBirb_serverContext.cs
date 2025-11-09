using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using flappyBirb_server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace flappyBirb_server.Data
{
    public class flappyBirb_serverContext : IdentityDbContext
    {
        public flappyBirb_serverContext (DbContextOptions<flappyBirb_serverContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Le Modèle One-To- doit être créé AVANT pour que son id existe.
            PasswordHasher<User> hasher = new PasswordHasher<User>(); // Si plusieurs utilisateurs, pas besoin de dupliquer cette ligne
            User u1 = new User
            {
                Id = "11111111-1111-1111-1111-111111111111", // Format GUID
                UserName = "youssef",
                Email = "youssef@mail.com",
                NormalizedUserName = "YOUSSEF",
                NormalizedEmail = "YOUSSEF@MAIL.COM"
            };
            // Hachage du mot de passe
            u1.PasswordHash = hasher.HashPassword(u1, "you");
            builder.Entity<User>().HasData(u1);

            User u2 = new User
            {
                Id = "11111111-1111-1111-1111-111111111112",
                UserName = "benkhada",
                Email = "benkhada@mail.com",
                NormalizedUserName = "BENKHADA",
                NormalizedEmail = "BENKHADA@MAIL.COM"
            };
            u2.PasswordHash = hasher.HashPassword(u2, "ben");
            builder.Entity<User>().HasData(u2);

            builder.Entity<Score>().HasData(
                new
                {
                    Id = 1,
                    Pseudo = "youssef",
                    Date = new DateTime(2024, 09, 11, 9, 00, 00).ToString(),
                    TimeInSeconds = 6.54,
                    ScoreValue = 88,
                    IsPublic = false,
                    UserId = u1.Id
                },
                new
                {
                    Id = 2,
                    Pseudo = "youssef",
                    Date = new DateTime(2025, 07, 25, 00, 00, 00).ToString(),
                    TimeInSeconds = 74.81,
                    ScoreValue = 43,
                    IsPublic = true,
                    UserId = u1.Id
                },
                new
                {
                    Id = 3,
                    Pseudo = "benkhada",
                    Date = new DateTime(2023, 01, 16, 04, 17, 00).ToString(),
                    TimeInSeconds = 15.52,
                    ScoreValue = 21,
                    IsPublic = false,
                    UserId = u2.Id
                },
                new
                {
                    Id = 4,
                    Pseudo = "benkhada",
                    Date = new DateTime(2022, 08, 25, 18, 13, 00).ToString(),
                    TimeInSeconds = 28.98,
                    ScoreValue = 16,
                    IsPublic = true,
                    UserId = u2.Id
                }
            );
        }

        public DbSet<Score> Scores { get; set; } = default!;
    }
}
