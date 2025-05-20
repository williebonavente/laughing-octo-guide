using System.ComponentModel.DataAnnotations;

namespace Polytype.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(32, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string PasswordHash { get; set; } = string.Empty;

        // TODO: Forogot password must be included here too
    }
}
