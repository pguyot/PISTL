using System;
using Project.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Microsoft.Extensions.Hosting;

[Route("api/domain")]
[ApiController]
public class DomainAdministrationController : ControllerBase
{
    [HttpGet]
    public IActionResult GetDomains()
    {
        try
        {
            var context = new DatContext();

            var domainsWithEnvironments = context.Domains
                .Join(
                    context.DomainEnvironments,
                    domain => domain.DomainId,
                    environment => environment.DomainId,
                    (domain, environment) => new { Domain = domain, Environment = environment }
                )
                .ToList();

            var mappedData = domainsWithEnvironments.GroupBy(
                pair => pair.Domain,
                pair => pair.Environment,
                (domain, environments) => new DomainModel
                {
                    Name = domain.Name,
                    Logo = domain.Logo,
                    Edition = domain.Edition,
                    IsSsoEnabled = domain.IsSsoEnabled,
                    Comment = domain.Comment,
                    ParentCompany = domain.ParentCompany,
                    Environments = environments.Select(environment => new EnvironmentModel
                    {
                        Environment = environment.Environment,
                        BpwebServerId = environment.BpwebServerId,
                        EaidatabaseId = environment.EaidatabaseId,
                        SsrsserverId = environment.SsrsserverId,
                        TableauServerId = environment.TableauServerId,
                        EaiftpserverId = environment.EaiftpserverId,
                        IsBp5Enabled = environment.IsBp5Enabled,
                        BpdatabaseId = environment.BpdatabaseId
                    }).ToList()
                }
            ).ToList();

            return Ok(mappedData);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public IActionResult PostDomain([FromBody] DomainModel model)
    {
        Console.WriteLine("===============> POST /api/domain");
        try
        {
            var context = new DatContext();
            Domain domain = addDomain(model.Name, model.Logo, model.Edition, model.IsSsoEnabled,
                                        model.Comment, model.ParentCompany);
            context.Domains.Add(domain);
            context.SaveChanges();

            List<DomainEnvironment> environments = addDomainEnvironments(domain.DomainId, model.Environments);

            foreach (DomainEnvironment e in environments)
                context.DomainEnvironments.Add(e);
            context.SaveChanges();

            return Ok(context.Domains);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public IActionResult PutDomain(int id, [FromBody] DomainModel model)
    {
        Console.WriteLine("===============> POST /api/domain");
        try
        {
            var context = new DatContext();
            var existingDomain = context.Domains.FirstOrDefault(d => d.DomainId == id);

            if (existingDomain == null)
                return NotFound($"Domain with ID {id} not found.");

            existingDomain.Name = model.Name;
            existingDomain.Logo = model.Logo;
            existingDomain.Edition = model.Edition;
            existingDomain.IsSsoEnabled = model.IsSsoEnabled;
            existingDomain.Comment = model.Comment;
            existingDomain.ParentCompany = model.ParentCompany;
            context.SaveChanges();

            return Ok(context.Domains);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteDomain(int id)
    {
        try
        {
            var context = new DatContext();
            var domainToDelete = context.Domains.FirstOrDefault(d => d.DomainId == id);

            if (domainToDelete == null)
                return NotFound($"Domain with ID {id} not found.");

            context.Domains.Remove(domainToDelete);
            context.SaveChanges();

            var remainingDomains = context.Domains.ToList();
            return Ok(remainingDomains);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // create a domain to add to the database
    static Domain addDomain
        (string name,
         byte[] logo,
         string edition,
         Boolean isSsoEnabled,
         string comment,
         string parentCompany)
    {

        var newDomain = new Domain
        {
            Name = name,
            Logo = logo,
            Edition = edition,
            IsSsoEnabled = isSsoEnabled,
            Comment = comment,
            ParentCompany = parentCompany
        };

        return newDomain;
    }

    static List<DomainEnvironment> addDomainEnvironments(int domainId, List<EnvironmentModel> environmentModel)
    {
        List<DomainEnvironment> environments = new List<DomainEnvironment>();

        foreach (EnvironmentModel e in environmentModel)
        {
            var environmentToAdd = new DomainEnvironment
            {
                DomainId = e.DomainId,
                Environment = e.Environment,
                BpwebServerId = e.BpwebServerId,
                BpdatabaseId = e.BpdatabaseId,
                EaidatabaseId = e.EaidatabaseId,
                SsrsserverId = e.SsrsserverId,
                TableauServerId = e.TableauServerId,
                EaiftpserverId = e.EaiftpserverId,
                IsBp5Enabled = e.IsBp5Enabled
            };
            environments.Add(environmentToAdd);
        }
        return environments;
    }

    public class DomainModel
    {
        public string Name { get; set; }
        public byte[] Logo { get; set; }
        public string Edition { get; set; }
        public Boolean IsSsoEnabled { get; set; }
        public string Comment { get; set; }
        public string ParentCompany { get; set; }
        public List<EnvironmentModel> Environments { get; set; }
    }

    public class EnvironmentModel
    {
        public int DomainId { get; set; }
        public int Environment { get; set; }
        public int BpwebServerId { get; set; }
        public int? BpdatabaseId { get; set; }
        public int? EaidatabaseId { get; set; }
        public int? SsrsserverId { get; set; }
        public int? TableauServerId { get; set; }
        public int? EaiftpserverId { get; set; }
        public bool IsBp5Enabled { get; set; }
    }
}

