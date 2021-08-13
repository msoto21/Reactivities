using System;

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; } // The EF will recognize this as the key for the DB table.
        public string Title { get; set; }  
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
    }
}