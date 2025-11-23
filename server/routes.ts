import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableDiscordClient } from "./discord-client";
import {
  insertCommandSchema,
  updateCommandSchema,
  updateBotSettingsSchema,
  type Command,
  type Server as DiscordServer,
  type ActivityLog,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/bot/stats", async (_req, res) => {
    try {
      const stats = await storage.getBotStats();
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
      const commands = await storage.getCommands();
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

  const httpServer = createServer(app);

  return httpServer;
}
