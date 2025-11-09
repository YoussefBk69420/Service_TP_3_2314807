using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using flappyBirb_server.Data;
using flappyBirb_server.Models;

namespace flappyBirb_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScoresController : ControllerBase
    {
        private readonly flappyBirb_serverContext _context;

        public ScoresController(flappyBirb_serverContext context)
        {
            _context = context;
        }

        // GET: api/Scores/GetPublicScores
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Score>>> GetPublicScores()
        //{
        //    return await _context.Score.ToListAsync();
        //}

        // GET: api/Scores/GetMyScore
        //[HttpGet]
        //public async Task<ActionResult<Score>> GetMyScore()
        //{
        //    var score = await _context.Score.FindAsync(id);

        //    if (score == null)
        //    {
        //        return NotFound();
        //    }

        //    return score;
        //}

        // PUT: api/Scores/ChangeScoreVisibility/{id}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> ChangeScoreVisibility(int id, Score score)
        //{
        //    if (id != score.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(score).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ScoreExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Scores/PostScore
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<Score>> PostScore(Score score)
        //{
        //    _context.Score.Add(score);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetScore", new { id = score.Id }, score);
        //} 
    }
}
