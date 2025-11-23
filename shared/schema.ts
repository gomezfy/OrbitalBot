import { z } from "zod";

export const botStatsSchema = z.object({
  serverCount: z.number(),
  userCount: z.number(),
  uptime: z.number(),
  commandsToday: z.number(),
  messagesProcessed: z.number(),
  activeChannels: z.number(),
});

export const serverSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  memberCount: z.number(),
  status: z.enum(["online", "offline", "error"]),
  joinedAt: z.string(),
});

export const commandSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  usageCount: z.number(),
  enabled: z.boolean(),
  lastUsed: z.string().nullable(),
});

export const activityLogSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(["command", "join", "leave", "error", "config"]),
  description: z.string(),
  serverId: z.string().nullable(),
  serverName: z.string().nullable(),
  userId: z.string().nullable(),
  username: z.string().nullable(),
  details: z.string().nullable(),
});

export const botSettingsSchema = z.object({
  prefix: z.string(),
  status: z.enum(["online", "idle", "dnd", "invisible"]),
  activity: z.string(),
  activityType: z.enum(["playing", "watching", "listening", "competing"]),
  autoResponse: z.boolean(),
  loggingEnabled: z.boolean(),
  moderationEnabled: z.boolean(),
});

export const updateBotTokenSchema = z.object({
  botToken: z.string().min(50, "Token do bot inválido"),
});

export const chartDataSchema = z.object({
  date: z.string(),
  commands: z.number(),
  messages: z.number(),
});

export const insertCommandSchema = commandSchema.omit({ id: true, usageCount: true, lastUsed: true });
export const updateCommandSchema = commandSchema.partial().required({ id: true });
export const updateBotSettingsSchema = botSettingsSchema;

export type BotStats = z.infer<typeof botStatsSchema>;
export type Server = z.infer<typeof serverSchema>;
export type Command = z.infer<typeof commandSchema>;
export type ActivityLog = z.infer<typeof activityLogSchema>;
export type BotSettings = z.infer<typeof botSettingsSchema>;
export type ChartData = z.infer<typeof chartDataSchema>;
export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type UpdateCommand = z.infer<typeof updateCommandSchema>;
export type UpdateBotSettings = z.infer<typeof updateBotSettingsSchema>;
export type UpdateBotToken = z.infer<typeof updateBotTokenSchema>;
