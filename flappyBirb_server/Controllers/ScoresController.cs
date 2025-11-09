using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using flappyBirb_server.Data;
using flappyBirb_server.Models;
using Microsoft.AspNetCore.Authorization;
using flappyBirb_server.Services;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using flappyBirb_server.Models.DTO;

namespace flappyBirb_server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ScoresController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ScoresService _scoresService;

        public ScoresController(UserManager<User> userManager, ScoresService scoresService)
        {
            _userManager = userManager;
            _scoresService = scoresService;
        }

        // GET: api/Scores/GetPublicScores
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Score>>> GetPublicScores()
        {
            var publicScores = await _scoresService.GetPublicScores();

            
            if (publicScores == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Message = "Veuillez réessayer plus tard." });
            }


            return publicScores;
        }

        // GET: api/Scores/GetMyScores
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<Score>>> GetMyScores()
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (user == null)
            {
                return Unauthorized();
            }

            
            var privateScores = await _scoresService.GetMyScores(user);

            if (privateScores == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Message = "Veuillez réessayer plus tard." });
            }


            return privateScores;
        }

        // PUT: api/Scores/ChangeScoreVisibility/{id}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> ChangeScoreVisibility(int id)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (user == null) return Unauthorized();

            Score? previousScore = await _scoresService.GetScore(id);

            if (previousScore == null) return NotFound();

            // Utilisateur pas propriétaire du score ?
            if (previousScore.User.Id != user.Id) return Unauthorized();

            Score? newScore = await _scoresService.ChangeScoreVisibility(id);

            if (newScore == null) return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = "Veuillez réessayer plus tard." }); // Problème avec la BD ?

            return Ok(new { Message = "Score modifié", Score = newScore });
        }

        //POST: api/Scores/PostScore
        //To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Score>> PostScore(ScoreDTO scoreDTO)
        {
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (user == null) return Unauthorized();


            var score = new Score
            {
                User = user,
                Date = DateTime.Now.ToString(),
                Pseudo = user.UserName!,
                TimeInSeconds = scoreDTO.TimeInSeconds,
                IsPublic = false,
                ScoreValue = scoreDTO.ScoreValue,          
            };

            Score? postScore = await _scoresService.PostScore(score);

            if (postScore == null) return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = "Veuillez réessayer plus tard." });

            return Ok(postScore);
        }
    }
}
