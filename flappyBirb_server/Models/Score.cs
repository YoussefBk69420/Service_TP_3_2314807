using System.Text.Json.Serialization;

namespace flappyBirb_server.Models
{
    public class Score
    {
        public int Id { get; set; }
        public string Pseudo { get; set; } = null!;
        public string Date { get; set; } = null!;
        public double TimeInSeconds { get; set; }
        public int ScoreValue { get; set; }
        public bool IsPublic { get; set; }
        [JsonIgnore]
        public virtual User User { get; set; } = null!;
    }
}
