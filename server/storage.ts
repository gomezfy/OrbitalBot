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
} from "@shared/schema";
import { randomUUID } from "crypto";

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
  
  getLogs(): Promise<ActivityLog[]>;
  getLog(id: string): Promise<ActivityLog | undefined>;
  createLog(log: Omit<ActivityLog, "id">): Promise<ActivityLog>;
  
  getSettings(): Promise<BotSettings>;
  updateSettings(settings: UpdateBotSettings): Promise<BotSettings>;
}

export class MemStorage implements IStorage {
  private servers: Map<string, Server>;
  private commands: Map<string, Command>;
  private logs: Map<string, ActivityLog>;
  private settings: BotSettings;
  private chartData: ChartData[];
  private startTime: number;

  constructor() {
    this.servers = new Map();
    this.commands = new Map();
    this.logs = new Map();
    this.startTime = Date.now();
    
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
}

export const storage = new MemStorage();
