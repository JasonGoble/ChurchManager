using ChurchManager.Domain.Common;
using ChurchManager.Domain.Members;

namespace ChurchManager.Domain.Sermons;

public enum VideoProvider { YouTube, Vimeo, Facebook, Custom }

public class Sermon : AuditableEntity
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime SermonDate { get; set; }
    public int? SpeakerMemberId { get; set; }
    public Member? Speaker { get; set; }
    public string? SpeakerName { get; set; }
    public string? ScriptureReference { get; set; }
    public int? SeriesId { get; set; }
    public SermonSeries? Series { get; set; }
    public VideoProvider? VideoProvider { get; set; }
    public string? VideoUrl { get; set; }
    public string? VideoEmbedCode { get; set; }
    public string? AudioUrl { get; set; }
    public string? NotesUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public int ViewCount { get; set; }
    public bool IsPublished { get; set; }
    public ICollection<SermonTag> Tags { get; set; } = [];
}
