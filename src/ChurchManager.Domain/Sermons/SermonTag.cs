using ChurchManager.Domain.Common;

namespace ChurchManager.Domain.Sermons;

public class SermonTag : BaseEntity
{
    public int SermonId { get; set; }
    public Sermon Sermon { get; set; } = default!;
    public string Tag { get; set; } = default!;
}
