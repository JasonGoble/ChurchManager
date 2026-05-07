using ChurchManager.Domain.Common;

namespace ChurchManager.Domain.Sermons;

public class SermonSeries : AuditableEntity
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<Sermon> Sermons { get; set; } = [];
}
