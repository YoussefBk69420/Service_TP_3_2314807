using flappyBirb_server.Models;
using flappyBirb_server.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace flappyBirb_server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterDTO register)
        {
            // Si Password et PasswordConfirm sont diférérent, on retourne une erreur.
            if (register.Password != register.PasswordConfirm)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Les deux mots de passe spécifiés sont différents." });
            }

            // On crée un nouvel utilisateur. Pour le moment on ne remplit que deux propriétés.
            User user = new User()
            {
                UserName = register.Username,
                Email = register.Email
            };

            // On tente d'ajouter l'utilisateur dans la base de données. Ça pourrait échouer si le mot de
            // passe ne respecte pas les conditions ou que le pseudonyme est déjà utilisé.
            IdentityResult identityResult = await _userManager.CreateAsync(user, register.Password);

            // Si la création a échoué, on retourne une erreur. N'hésitez pas à mettre un breakpoint ici
            // pour inspecter l'objet identityResult si vous avez du mal à créer des utilisateurs.
            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "La création de l'utilisateur a échoué." });
            }
            return Ok(new { Message = "Inscription réussie ! 🥳" });
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginDTO login)
        {
            // Tenter de trouver l'utilisateur dans la BD à partir de son pseudo
            User? user = await _userManager.FindByNameAsync(login.Username);

            // Si l'utilisateur existe ET que son mot de passe est exact
            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                // Récupérer les rôles de l'utilisateur (Cours 22+)
                IList<string> roles = await _userManager.GetRolesAsync(user);
                List<Claim> authClaims = new List<Claim>();
                foreach (string role in roles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                authClaims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));

                // Générer et chiffrer le token 
                SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8
                    .GetBytes("LooOOongue Phrase SiNoN Ça ne Marchera PaAaAAAaAas !")); // Phrase identique dans Program.cs
                JwtSecurityToken token = new JwtSecurityToken(
                    issuer: "https://localhost:7249", // ⛔ Vérifiez le PORT de votre serveur dans launchSettings.json !
                    audience: "http://localhost:4200",
                    claims: authClaims,
                    expires: DateTime.Now.AddMinutes(30), // Durée de validité du token
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
                    );

                // Envoyer le token à l'application cliente sous forme d'objet JSON
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    validTo = token.ValidTo
                });
            }
            // Utilisateur inexistant ou mot de passe incorrecte
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Le nom d'utilisateur ou le mot de passe est invalide." });
            }
        }
    }
}
