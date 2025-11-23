import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableDiscordClient } from "./discord-client";
import { requireAuth, app } from "./app";
import rateLimit from "express-rate-limit";
import {
  insertCommandSchema,
  updateCommandSchema,
  updateBotSettingsSchema,
  updateBotTokenSchema,
  updateBotLanguagesSchema,
  type Command,
  type Server as DiscordServer,
  type ActivityLog,
  type BotUser,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(appInstance: Express): Promise<Server> {
  // Create requireBotOwner middleware with access to storage
  const requireBotOwner = (req: Request, _res: Response, next: NextFunction) => {
    const session = (req as any).session;
    if (!session?.userId) {
      return _res.status(401).json({ error: "Não autenticado" });
    }
    
    const botOwnerId = storage.getBotOwnerId();
    
    if (!botOwnerId) {
      return _res.status(403).json({ error: "Bot não configurado - proprietário desconhecido" });
    }
    
    if (session.userId !== botOwnerId) {
      return _res.status(403).json({ error: "Você não tem permissão para modificar este bot. Apenas o proprietário pode fazer alterações." });
    }
    
    next();
  };

  // Auth-specific rate limiter
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentativas por IP
    skipSuccessfulRequests: true,
    message: 'Muitas tentativas de login, tente novamente mais tarde',
  });

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

  app.post("/api/commands", requireBotOwner, async (req, res) => {
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

  app.patch("/api/commands/:id", requireBotOwner, async (req, res) => {
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

  app.delete("/api/commands/:id", requireBotOwner, async (req, res) => {
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

  app.put("/api/settings", requireBotOwner, async (req, res) => {
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

  app.post("/api/bot/token", requireAuth, async (req, res) => {
    try {
      const validation = updateBotTokenSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error });
      }

      // Validate the token by trying to connect to Discord
      let botOwnerId: string | null = null;
      try {
        const testClient = await getUncachableDiscordClient(validation.data.botToken);
        botOwnerId = testClient.application?.owner?.id || null;
        await testClient.destroy();
      } catch (tokenError) {
        console.error("Invalid bot token:", tokenError);
        return res.status(400).json({ error: "Token do bot Discord inválido" });
      }

      // Store the bot owner ID
      if (botOwnerId) {
        storage.setBotOwnerId(botOwnerId);
        console.log(`Bot owner set to: ${botOwnerId}`);
      }

      // Verify that the logged-in user is the bot owner
      const session = (req as any).session;
      if (botOwnerId && session?.userId !== botOwnerId) {
        return res.status(403).json({ error: "Este token pertence a outro bot. Apenas o proprietário do bot pode configurá-lo." });
      }

      process.env.DISCORD_BOT_TOKEN = validation.data.botToken;

      // If languages are provided, update them automatically
      if (validation.data.languages && validation.data.languages.length > 0) {
        await storage.updateBotLanguages(validation.data.languages);
      }

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
      res.status(500).json({ error: "Falha ao configurar token do bot" });
    }
  });

  app.get("/api/user", async (req, res) => {
    try {
      const session = (req as any).session;
      
      // Return logged-in user data from session
      if (session?.userId && session?.userTag) {
        let avatarUrl = null;
        
        // Construct Discord avatar URL if avatar hash exists
        if (session.userAvatar) {
          avatarUrl = `https://cdn.discordapp.com/avatars/${session.userId}/${session.userAvatar}.png`;
        }
        
        const user: BotUser = {
          id: session.userId,
          username: session.userTag,
          displayName: session.userTag,
          avatar: avatarUrl,
          isDeveloper: session.isDeveloper || false,
        };
        
        return res.json(user);
      }

      // Fallback: try to get bot user info
      let user: BotUser | null = null;

      try {
        const client = await getUncachableDiscordClient();
        const botUser = client.user;

        if (botUser) {
          const flags = botUser.flags?.bitfield || 0;
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

  app.get("/api/auth/me", (_req, res) => {
    const session = (_req as any).session;
    if (session?.userId) {
      res.json({ authenticated: true, userId: session.userId });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  app.get("/api/auth/discord", authLimiter, (_req, res) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    
    if (!clientId) {
      console.error("DISCORD_CLIENT_ID not found");
      return res.redirect("/login?error=no_client_id");
    }

    // Detect protocol: use https if on Replit or production, http for localhost
    const protocol = _req.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
    const host = _req.get("host") || "localhost:5000";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;
    const scopes = ["identify", "email", "guilds"];
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes.join("%20")}`;
    
    console.log("OAuth redirectUri:", redirectUri);
    console.log("OAuth authUrl:", authUrl);
    
    res.redirect(authUrl);
  });

  app.get("/api/auth/callback", authLimiter, async (req, res) => {
    const code = req.query.code as string;
    const error = req.query.error as string;
    
    console.log("Auth callback received:", { code: code ? "present" : "missing", error });
    
    if (error) {
      console.error("Discord OAuth error:", error, req.query.error_description);
      return res.redirect("/login?error=" + error);
    }
    
    if (!code) {
      console.error("No code provided");
      return res.redirect("/login?error=no_code");
    }

    try {
      const clientId = process.env.DISCORD_CLIENT_ID;
      const clientSecret = process.env.DISCORD_CLIENT_SECRET;
      const protocol = req.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
      const host = req.get("host") || "localhost:5000";
      const redirectUri = `${protocol}://${host}/api/auth/callback`;

      console.log("Token exchange with redirectUri:", redirectUri);

      if (!clientId || !clientSecret) {
        console.error("Credentials missing:", { clientId: !!clientId, clientSecret: !!clientSecret });
        throw new Error("Discord credentials not configured");
      }

      // Exchange code for token
      const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", tokenResponse.status, errorText);
        throw new Error("Token exchange failed: " + errorText);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Get user info
      const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user info");
      }

      const user = await userResponse.json();

      // Fetch user flags to check for Developer badge
      const userFlags = user.flags || 0;
      
      // Discord user flags
      const DEVELOPER = 1 << 17; // 131072
      const EARLY_VERIFIED_BOT_DEVELOPER = 1 << 22; // 4194304
      
      const isDeveloper = (userFlags & DEVELOPER) !== 0 || (userFlags & EARLY_VERIFIED_BOT_DEVELOPER) !== 0;

      console.log("User OAuth login:", {
        id: user.id,
        username: user.username,
        flags: userFlags,
        flagsBinary: userFlags.toString(2),
        isDeveloper,
        hasDeveloperFlag: (userFlags & DEVELOPER) !== 0,
        hasEarlyVerifiedFlag: (userFlags & EARLY_VERIFIED_BOT_DEVELOPER) !== 0,
        avatar: user.avatar ? "present" : "missing"
      });

      // Store in session
      const reqWithSession = req as any;
      reqWithSession.session.userId = user.id;
      reqWithSession.session.userTag = user.username;
      reqWithSession.session.userDiscriminator = user.discriminator;
      reqWithSession.session.userAvatar = user.avatar;
      reqWithSession.session.isDeveloper = isDeveloper;
      
      res.redirect("/");
    } catch (error) {
      console.error("Auth callback error:", error);
      res.redirect("/login?error=auth_failed");
    }
  });

  app.get("/api/bot/languages", async (_req, res) => {
    try {
      const botInfo = await storage.getBotLanguages();
      res.json(botInfo);
    } catch (error) {
      console.error("Error fetching bot languages:", error);
      res.status(500).json({ error: "Failed to fetch bot languages" });
    }
  });

  app.post("/api/bot/languages", async (req, res) => {
    try {
      const body = updateBotLanguagesSchema.parse(req.body);
      const botInfo = await storage.updateBotLanguages(body.languages);
      res.json(botInfo);
    } catch (error) {
      console.error("Error updating bot languages:", error);
      res.status(400).json({ error: "Invalid languages" });
    }
  });

  app.get("/api/auth/logout", (req, res) => {
    const reqWithSession = req as any;
    reqWithSession.session?.destroy(() => {
      res.redirect("/login");
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
