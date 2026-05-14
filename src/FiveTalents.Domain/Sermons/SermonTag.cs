using FiveTalents.Domain.Common;

namespace FiveTalents.Domain.Sermons;

public class SermonTag : BaseEntity
{
    public int SermonId { get; set; }
    public Sermon Sermon { get; set; } = default!;
    public string Tag { get; set; } = default!;
}
