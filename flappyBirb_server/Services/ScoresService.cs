using flappyBirb_server.Data;
using flappyBirb_server.Models;

using Microsoft.EntityFrameworkCore;

namespace flappyBirb_server.Services
{
    public class ScoresService
    {
        private readonly flappyBirb_serverContext _context;

        public ScoresService(flappyBirb_serverContext context)
        {
            _context = context;
        }

        private bool IsContextValid() => _context != null && _context.Scores != null;

        public async Task<Score?> GetScore(int id)
        {
            if (!IsContextValid()) return null;

            return await _context.Scores.FindAsync(id);
        }

        public async Task<List<Score>> GetPublicScores()
        {
            if (!IsContextValid()) return new List<Score>();

            var publicScores = await _context.Scores.Where(s => s.IsPublic == true).OrderByDescending(s => s.ScoreValue).Take(10).ToListAsync();

            return publicScores;
        }

        public async Task<List<Score>> GetMyScores(User user)
        {
            if (!IsContextValid()) return new List<Score>();

            var privateScores = await _context.Scores.Where(s => s.User.Id == user.Id).ToListAsync();

            return privateScores;
        }

        public async Task<Score?> ChangeScoreVisibility(int id)
        {
            if (!IsContextValid()) return null;

            Score? s = await _context.Scores.FindAsync(id);
            if (s == null) return null;
            try
            {
                s.IsPublic = !s.IsPublic;
                await _context.SaveChangesAsync();

                return s;
            }
            catch (DbUpdateConcurrencyException)
            {
                return null;
            }
        }

        public async Task<Score?> PostScore(Score score)
        {
            if (!IsContextValid()) return null;

            if (score == null) return null;

            _context.Scores.Add(score);
            await _context.SaveChangesAsync();

            return score;
        }
    }
}
