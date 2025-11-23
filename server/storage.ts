import {
  type BotStats,
  type Server,
  type Command,
  type ActivityLog,
  type BotSettings,
  type ChartData,
  type InsertCommand,
  type UpdateCommand,
  type UpdateBotSettings,
  type BotLanguage,
  type BotInfo,
} from "@shared/schema";
import { randomUUID } from "crypto";

const LANGUAGE_OPTIONS: Record<string, BotLanguage> = {
  typescript: { language: "TypeScript", badge: "TS", color: "#3178c6" },
  javascript: { language: "JavaScript", badge: "JS", color: "#f7df1e" },
  python: { language: "Python", badge: "PY", color: "#3776ab" },
  java: { language: "Java", badge: "JAVA", color: "#007396" },
  cpp: { language: "C++", badge: "C++", color: "#00599c" },
  csharp: { language: "C#", badge: "C#", color: "#239120" },
  go: { language: "Go", badge: "GO", color: "#00add8" },
  rust: { language: "Rust", badge: "RS", color: "#ce422b" },
};

export interface IStorage {
  getBotStats(): Promise<BotStats>;
  getChartData(): Promise<ChartData[]>;
  
  getServers(): Promise<Server[]>;
  getServer(id: string): Promise<Server | undefined>;
  
  getCommands(): Promise<Command[]>;
  getCommand(id: string): Promise<Command | undefined>;
  createCommand(command: InsertCommand): Promise<Command>;
  updateCommand(update: UpdateCommand): Promise<Command>;
  deleteCommand(id: string): Promise<boolean>;
  syncCommands(commands: Command[]): Promise<void>;
  
  getLogs(): Promise<ActivityLog[]>;
  getLog(id: string): Promise<ActivityLog | undefined>;
  createLog(log: Omit<ActivityLog, "id">): Promise<ActivityLog>;
  
  getSettings(): Promise<BotSettings>;
  updateSettings(settings: UpdateBotSettings): Promise<BotSettings>;

  getBotLanguages(): Promise<BotInfo>;
  updateBotLanguages(languages: string[]): Promise<BotInfo>;
  
  getDiscordOAuthConfig(): Promise<{ clientId: string; clientSecret: string } | null>;
  setDiscordOAuthConfig(clientId: string, clientSecret: string): void;
}

export class MemStorage implements IStorage {
  private servers: Map<string, Server>;
  private commands: Map<string, Command>;
  private logs: Map<string, ActivityLog>;
  private settings: BotSettings;
  private chartData: ChartData[];
  private startTime: number;
  private botLanguages: BotLanguage[];
  private botOwnerId: string | null;
  private discordClientId: string | null;
  private discordClientSecret: string | null;

  constructor() {
    this.servers = new Map();
    this.commands = new Map();
    this.logs = new Map();
    this.startTime = Date.now();
    this.botLanguages = [];
    this.botOwnerId = null;
    this.discordClientId = null;
    this.discordClientSecret = null;
    
    this.settings = {
      prefix: "!",
      status: "online",
      activity: "com os comandos",
      activityType: "playing",
      autoResponse: true,
      loggingEnabled: true,
      moderationEnabled: false,
    };

    this.chartData = [];
    this.initializeMockData();
  }

  private initializeMockData() {
    const now = Date.now();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      this.chartData.push({
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        commands: Math.floor(Math.random() * 500) + 200,
        messages: Math.floor(Math.random() * 2000) + 1000,
      });
    }

    const sampleCommands: Command[] = [
      {
        id: "1",
        name: "help",
        description: "Exibe todos os comandos disponíveis",
        category: "Utilidade",
        usageCount: 1250,
        enabled: true,
        lastUsed: new Date(now - 3600000).toISOString(),
      },
      {
        id: "2",
        name: "ping",
        description: "Verifica a latência do bot",
        category: "Utilidade",
        usageCount: 892,
        enabled: true,
        lastUsed: new Date(now - 7200000).toISOString(),
      },
      {
        id: "3",
        name: "kick",
        description: "Expulsa um membro do servidor",
        category: "Moderação",
        usageCount: 45,
        enabled: true,
        lastUsed: new Date(now - 86400000).toISOString(),
      },
      {
        id: "4",
        name: "ban",
        description: "Bane um membro do servidor",
        category: "Moderação",
        usageCount: 23,
        enabled: true,
        lastUsed: new Date(now - 172800000).toISOString(),
      },
      {
        id: "5",
        name: "mute",
        description: "Silencia um membro temporariamente",
        category: "Moderação",
        usageCount: 67,
        enabled: false,
        lastUsed: new Date(now - 259200000).toISOString(),
      },
      {
        id: "6",
        name: "play",
        description: "Reproduz música no canal de voz",
        category: "Música",
        usageCount: 3421,
        enabled: true,
        lastUsed: new Date(now - 1800000).toISOString(),
      },
      {
        id: "7",
        name: "skip",
        description: "Pula para a próxima música",
        category: "Música",
        usageCount: 2156,
        enabled: true,
        lastUsed: new Date(now - 2400000).toISOString(),
      },
      {
        id: "8",
        name: "queue",
        description: "Mostra a fila de músicas",
        category: "Música",
        usageCount: 1534,
        enabled: true,
        lastUsed: new Date(now - 3000000).toISOString(),
      },
      {
        id: "9",
        name: "avatar",
        description: "Mostra o avatar de um usuário",
        category: "Diversão",
        usageCount: 432,
        enabled: true,
        lastUsed: new Date(now - 14400000).toISOString(),
      },
      {
        id: "10",
        name: "poll",
        description: "Cria uma enquete",
        category: "Utilidade",
        usageCount: 189,
        enabled: true,
        lastUsed: new Date(now - 43200000).toISOString(),
      },
    ];

    sampleCommands.forEach(cmd => this.commands.set(cmd.id, cmd));

    const sampleServers: Server[] = [
      {
        id: "guild1",
        name: "Servidor Geral",
        icon: null,
        memberCount: 1250,
        status: "online",
        joinedAt: new Date(now - 7776000000).toISOString(),
      },
      {
        id: "guild2",
        name: "Servidor de Música",
        icon: null,
        memberCount: 850,
        status: "online",
        joinedAt: new Date(now - 5184000000).toISOString(),
      },
      {
        id: "guild3",
        name: "Comunidade Gaming",
        icon: null,
        memberCount: 2100,
        status: "online",
        joinedAt: new Date(now - 2592000000).toISOString(),
      },
      {
        id: "guild4",
        name: "Dev Squad",
        icon: null,
        memberCount: 420,
        status: "online",
        joinedAt: new Date(now - 1296000000).toISOString(),
      },
      {
        id: "guild5",
        name: "Anime Lovers",
        icon: null,
        memberCount: 1890,
        status: "online",
        joinedAt: new Date(now - 864000000).toISOString(),
      },
    ];

    sampleServers.forEach(server => this.servers.set(server.id, server));

    const sampleLogs: ActivityLog[] = [
      {
        id: "log1",
        timestamp: new Date(now - 600000).toISOString(),
        type: "command",
        description: "Comando /help executado",
        serverId: null,
        serverName: "Servidor Geral",
        userId: "user123",
        username: "João#1234",
        details: "Categoria: Utilidade",
      },
      {
        id: "log2",
        timestamp: new Date(now - 1200000).toISOString(),
        type: "command",
        description: "Comando /play executado",
        serverId: null,
        serverName: "Servidor de Música",
        userId: "user456",
        username: "Maria#5678",
        details: "Música: Never Gonna Give You Up",
      },
      {
        id: "log3",
        timestamp: new Date(now - 1800000).toISOString(),
        type: "join",
        description: "Bot adicionado a um novo servidor",
        serverId: null,
        serverName: "Comunidade Gaming",
        userId: null,
        username: null,
        details: "150 membros",
      },
      {
        id: "log4",
        timestamp: new Date(now - 3600000).toISOString(),
        type: "config",
        description: "Prefixo alterado de ! para /",
        serverId: null,
        serverName: null,
        userId: "admin789",
        username: "Admin#0001",
        details: null,
      },
      {
        id: "log5",
        timestamp: new Date(now - 7200000).toISOString(),
        type: "command",
        description: "Comando /kick executado",
        serverId: null,
        serverName: "Servidor Geral",
        userId: "mod123",
        username: "Moderador#9999",
        details: "Usuário expulso: Spam#1111",
      },
      {
        id: "log6",
        timestamp: new Date(now - 10800000).toISOString(),
        type: "error",
        description: "Erro ao conectar ao canal de voz",
        serverId: null,
        serverName: "Servidor de Música",
        userId: null,
        username: null,
        details: "Permissões insuficientes",
      },
      {
        id: "log7",
        timestamp: new Date(now - 14400000).toISOString(),
        type: "command",
        description: "Comando /queue executado",
        serverId: null,
        serverName: "Servidor de Música",
        userId: "user789",
        username: "Pedro#4321",
        details: "5 músicas na fila",
      },
      {
        id: "log8",
        timestamp: new Date(now - 21600000).toISOString(),
        type: "config",
        description: "Status do bot alterado para 'Ouvindo música'",
        serverId: null,
        serverName: null,
        userId: "admin789",
        username: "Admin#0001",
        details: null,
      },
    ];

    sampleLogs.forEach(log => this.logs.set(log.id, log));
  }

  async getBotStats(): Promise<BotStats> {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    
    const commandLogs = Array.from(this.logs.values()).filter(
      (log) => log.type === "command"
    );
    const commandsToday = commandLogs.length;
    
    return {
      serverCount: this.servers.size,
      userCount: Array.from(this.servers.values()).reduce(
        (sum, server) => sum + server.memberCount,
        0
      ),
      uptime,
      commandsToday,
      messagesProcessed: Math.floor(Math.random() * 50000) + 10000,
      activeChannels: Math.floor(Math.random() * 50) + 20,
    };
  }

  async getChartData(): Promise<ChartData[]> {
    return this.chartData;
  }

  async getServers(): Promise<Server[]> {
    return Array.from(this.servers.values());
  }

  async getServer(id: string): Promise<Server | undefined> {
    return this.servers.get(id);
  }

  async getCommands(): Promise<Command[]> {
    return Array.from(this.commands.values());
  }

  async getCommand(id: string): Promise<Command | undefined> {
    return this.commands.get(id);
  }

  async createCommand(insertCommand: InsertCommand): Promise<Command> {
    const id = randomUUID();
    const command: Command = {
      ...insertCommand,
      id,
      usageCount: 0,
      lastUsed: null,
    };
    this.commands.set(id, command);
    return command;
  }

  async updateCommand(update: UpdateCommand): Promise<Command> {
    const existing = this.commands.get(update.id);
    if (!existing) {
      throw new Error("Command not found");
    }
    const updated = { ...existing, ...update };
    this.commands.set(update.id, updated);
    return updated;
  }

  async deleteCommand(id: string): Promise<boolean> {
    return this.commands.delete(id);
  }

  async syncCommands(commands: Command[]): Promise<void> {
    // Merge Discord commands with local modifications (keep enabled/disabled state)
    commands.forEach(newCmd => {
      const existing = this.commands.get(newCmd.id);
      if (existing) {
        // Preserve local modifications (enabled state, usageCount, lastUsed)
        const merged = {
          ...newCmd,
          enabled: existing.enabled, // Keep local enabled/disabled state
          usageCount: existing.usageCount,
          lastUsed: existing.lastUsed,
        };
        this.commands.set(newCmd.id, merged);
      } else {
        // New command from Discord API
        this.commands.set(newCmd.id, newCmd);
      }
    });
    
    // Remove commands that no longer exist in Discord
    const discordIds = new Set(commands.map(cmd => cmd.id));
    for (const id of this.commands.keys()) {
      if (!discordIds.has(id)) {
        this.commands.delete(id);
      }
    }
  }

  async getLogs(): Promise<ActivityLog[]> {
    return Array.from(this.logs.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getLog(id: string): Promise<ActivityLog | undefined> {
    return this.logs.get(id);
  }

  async createLog(logData: Omit<ActivityLog, "id">): Promise<ActivityLog> {
    const id = randomUUID();
    const log: ActivityLog = { ...logData, id };
    this.logs.set(id, log);
    return log;
  }

  async getSettings(): Promise<BotSettings> {
    return this.settings;
  }

  async updateSettings(newSettings: UpdateBotSettings): Promise<BotSettings> {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  async getBotLanguages(): Promise<BotInfo> {
    return { languages: this.botLanguages };
  }

  async updateBotLanguages(languages: string[]): Promise<BotInfo> {
    this.botLanguages = languages
      .map(lang => LANGUAGE_OPTIONS[lang.toLowerCase()])
      .filter((lang): lang is BotLanguage => lang !== undefined);
    return { languages: this.botLanguages };
  }

  setBotOwnerId(userId: string): void {
    this.botOwnerId = userId;
  }

  getBotOwnerId(): string | null {
    return this.botOwnerId;
  }

  getDiscordOAuthConfig(): Promise<{ clientId: string; clientSecret: string } | null> {
    if (this.discordClientId && this.discordClientSecret) {
      return Promise.resolve({
        clientId: this.discordClientId,
        clientSecret: this.discordClientSecret,
      });
    }
    return Promise.resolve(null);
  }

  setDiscordOAuthConfig(clientId: string, clientSecret: string): void {
    this.discordClientId = clientId;
    this.discordClientSecret = clientSecret;
  }
}

export const storage = new MemStorage();
