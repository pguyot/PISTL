﻿using Microsoft.EntityFrameworkCore;
using Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project.Interface
{
    public interface IServerRepository
    {
        Server GetServer(int id);
        Server GetServer(string name);
        Server GetServerWithAddress(string address);
        ICollection<Server> GetServers();
        bool ServerExists(int Id);
        bool ServerExists(string ServerName);
        bool ServerExistsWithAddress(string ServerAddress);
        bool CreateServer(Server db);
        bool Save();
        bool DeleteServer(Server db);
        bool UpdateServer(Server db);
        int GetServerCount();
        public int GetUnusedMinServerId();
        public bool AddDatabaseToServer(int databaseId, int serverId);

    }
}
