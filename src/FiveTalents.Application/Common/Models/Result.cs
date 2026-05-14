namespace FiveTalents.Application.Common.Models;

public record Result(bool Succeeded, string[] Errors)
{
    public static Result Success() => new(true, []);
    public static Result Failure(params string[] errors) => new(false, errors);
}

public record Result<T>(bool Succeeded, T? Data, string[] Errors) : Result(Succeeded, Errors)
{
    public static Result<T> Success(T data) => new(true, data, []);
    public static new Result<T> Failure(params string[] errors) => new(false, default, errors);
}
