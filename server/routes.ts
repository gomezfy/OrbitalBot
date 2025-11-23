import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableDiscordClient } from "./discord-client";
import {
  insertCommandSchema,
  updateCommandSchema,
  updateBotSettingsSchema,
  updateBotTokenSchema,
  type Command,
  type Server as DiscordServer,
  type ActivityLog,
  type BotUser,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/bot/stats", async (_req, res) => {
    try {
      let stats = await storage.getBotStats();
      
      try {
        const client = await getUncachableDiscordClient();
        const guilds = client.guilds.cache;
        
        const serverCount = guilds.size;
        const userCount = Array.from(guilds.values()).reduce(
          (sum, guild) => sum + guild.memberCount,
          0
        );
        
        let commandsToday = stats.commandsToday;
        try {
          const commands = await client.application?.commands.fetch().catch(() => null);
          if (commands && commands.size > 0) {
            commandsToday = commands.size;
          } else {
            const storageCommands = await storage.getCommands();
            commandsToday = storageCommands.length;
          }
        } catch (err) {
          console.error("Error fetching commands:", err);
          const storageCommands = await storage.getCommands();
          commandsToday = storageCommands.length;
        }
        
        await client.destroy();
        
        stats = {
          ...stats,
          serverCount,
          userCount,
          commandsToday,
        };
      } catch (discordError) {
        console.error("Discord API error for stats, using storage:", discordError);
        const storageCommands = await storage.getCommands();
        stats = {
          ...stats,
          commandsToday: storageCommands.length,
        };
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching bot stats:", error);
      res.status(500).json({ error: "Failed to fetch bot stats" });
    }
  });

  app.get("/api/bot/chart", async (_req, res) => {
    try {
      const chartData = await storage.getChartData();
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  app.get("/api/servers", async (_req, res) => {
    try {
      let servers: DiscordServer[] = [];
      
      try {
        const client = await getUncachableDiscordClient();
        const guilds = client.guilds.cache;
        
        servers = Array.from(guilds.values()).map((guild) => ({
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL() || null,
          memberCount: guild.memberCount,
          status: "online" as const,
          joinedAt: guild.joinedAt?.toISOString() || new Date().toISOString(),
        }));

        await storage.createLog({
          timestamp: new Date().toISOString(),
          type: "config",
          description: `Dados de ${servers.length} servidor(es) carregados do Discord`,
          serverId: null,
          serverName: null,
          userId: null,
          username: null,
          details: null,
        });

        await client.destroy();
      } catch (discordError) {
        console.error("Discord API error, using storage:", discordError);
        servers = await storage.getServers();
      }

      res.json(servers);
    } catch (error) {
      console.error("Error fetching servers:", error);
      res.status(500).json({ error: "Failed to fetch servers" });
    }
  });

  app.get("/api/commands", async (_req, res) => {
    try {
      let commands: Command[] = [];
      
      try {
        const client = await getUncachableDiscordClient();
        
        const appCommands = await client.application?.commands.fetch().catch(() => null);
        if (appCommands && appCommands.size > 0) {
          commands = Array.from(appCommands.values()).map((cmd) => ({
            id: cmd.id,
            name: cmd.name,
            description: cmd.description || "Sem descrição",
            category: cmd.name.split("_")[0] || "Geral",
            usageCount: 0,
            enabled: true,
            lastUsed: null,
          }));
        }
        
        await client.destroy();
      } catch (discordError) {
        console.error("Discord API error for commands, using storage:", discordError);
        commands = await storage.getCommands();
      }
      
      res.json(commands);
    } catch (error) {
      console.error("Error fetching commands:", error);
      res.status(500).json({ error: "Failed to fetch commands" });
    }
  });

  app.post("/api/commands", async (req, res) => {
    try {
      const validation = insertCommandSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error });
      }

      const command = await storage.createCommand(validation.data);
      
      await storage.createLog({
        timestamp: new Date().toISOString(),
        type: "config",
        description: `Comando /${command.name} criado`,
        serverId: null,
        serverName: null,
        userId: null,
        username: null,
        details: `Categoria: ${command.category}`,
      });

      res.status(201).json(command);
    } catch (error) {
      console.error("Error creating command:", error);
      res.status(500).json({ error: "Failed to create command" });
    }
  });

  app.patch("/api/commands/:id", async (req, res) => {
    try {
      const validation = updateCommandSchema.safeParse({
        ...req.body,
        id: req.params.id,
      });
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error });
      }

      const command = await storage.updateCommand(validation.data);
      
      await storage.createLog({
        timestamp: new Date().toISOString(),
        type: "config",
        description: `Comando /${command.name} atualizado`,
        serverId: null,
        serverName: null,
        userId: null,
        username: null,
        details: command.enabled ? "Ativado" : "Desativado",
      });

      res.json(command);
    } catch (error) {
      console.error("Error updating command:", error);
      res.status(500).json({ error: "Failed to update command" });
    }
  });

  app.delete("/api/commands/:id", async (req, res) => {
    try {
      const command = await storage.getCommand(req.params.id);
      const success = await storage.deleteCommand(req.params.id);
      
      if (success && command) {
        await storage.createLog({
          timestamp: new Date().toISOString(),
          type: "config",
          description: `Comando /${command.name} removido`,
          serverId: null,
          serverName: null,
          userId: null,
          username: null,
          details: null,
        });
      }

      res.json({ success });
    } catch (error) {
      console.error("Error deleting command:", error);
      res.status(500).json({ error: "Failed to delete command" });
    }
  });

  app.get("/api/logs", async (_req, res) => {
    try {
      const logs = await storage.getLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validation = updateBotSettingsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error });
      }

      const settings = await storage.updateSettings(validation.data);
      
      await storage.createLog({
        timestamp: new Date().toISOString(),
        type: "config",
        description: "Configurações do bot atualizadas",
        serverId: null,
        serverName: null,
        userId: null,
        username: null,
        details: `Prefixo: ${settings.prefix}, Status: ${settings.status}`,
      });

      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.post("/api/bot/token", async (req, res) => {
    try {
      const validation = updateBotTokenSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error });
      }

      process.env.DISCORD_BOT_TOKEN = validation.data.botToken;

      await storage.createLog({
        timestamp: new Date().toISOString(),
        type: "config",
        description: "Token do bot Discord configurado",
        serverId: null,
        serverName: null,
        userId: null,
        username: null,
        details: "Token configurado - o bot será reiniciado automaticamente",
      });

      res.json({ success: true, message: "Token configurado com sucesso" });
    } catch (error) {
      console.error("Error updating bot token:", error);
      res.status(500).json({ error: "Failed to update bot token" });
    }
  });

  app.get("/api/user", async (_req, res) => {
    try {
      let user: BotUser | null = null;

      try {
        const client = await getUncachableDiscordClient();
        const botUser = client.user;

        if (botUser) {
          const flags = botUser.flags?.bitfield || 0;
          const DISCORD_EMPLOYEE = 1 << 0;
          const DISCORD_PARTNER = 1 << 1;
          const BUG_HUNTER_LEVEL_1 = 1 << 3;
          const BUG_HUNTER_LEVEL_2 = 1 << 14;
          const EARLY_ADOPTER = 1 << 9;
          const DEVELOPER = 1 << 17;

          const isDeveloper = (flags & DEVELOPER) !== 0;

          user = {
            id: botUser.id,
            username: botUser.username,
            displayName: botUser.globalName || botUser.username,
            avatar: botUser.avatarURL(),
            isDeveloper,
          };
        }

        await client.destroy();
      } catch (discordError) {
        console.error("Discord API error for user:", discordError);
      }

      if (!user) {
        user = {
          id: "unknown",
          username: "Unknown",
          displayName: "Unknown User",
          avatar: null,
          isDeveloper: false,
        };
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
