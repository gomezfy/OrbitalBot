import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Server, Users, Zap, MessageSquare, Radio, Code } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { type BotStats, type ChartData, type ActivityLog, type BotUser } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

const statCards = [
  { title: "Servidores", icon: Server, key: "serverCount" as const, color: "text-chart-1" },
  { title: "Usuários", icon: Users, key: "userCount" as const, color: "text-chart-2" },
  { title: "Comandos Hoje", icon: Zap, key: "commandsToday" as const, color: "text-chart-3" },
  { title: "Canais Ativos", icon: Radio, key: "activeChannels" as const, color: "text-chart-4" },
];

const activityIcons = {
  command: Terminal,
  join: UserPlus,
  leave: UserMinus,
  error: AlertCircle,
  config: Settings,
};

import { Terminal, UserPlus, UserMinus, AlertCircle, Settings } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<BotStats>({
    queryKey: ["/api/bot/stats"],
  });

  const { data: chartData, isLoading: chartLoading } = useQuery<ChartData[]>({
    queryKey: ["/api/bot/chart"],
  });

  const { data: logs, isLoading: logsLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/logs"],
  });

  const { data: user, isLoading: userLoading } = useQuery<BotUser>({
    queryKey: ["/api/user"],
  });

  function formatUptime(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu bot Discord</p>
        </div>
        
        {userLoading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ) : user ? (
          <Card className="w-fit">
            <CardContent className="p-4">
              <div className="flex items-center gap-3" data-testid="card-user-profile">
                <Avatar>
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold" data-testid="text-user-name">{user.displayName}</p>
                  {user.isDeveloper ? (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600/20 border border-green-600/40" data-testid="badge-developer" title="Developer Ativo">
                      <Code className="h-3.5 w-3.5" style={{ color: "#57F287" }} />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground" data-testid="text-user-tag">@{user.username}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} data-testid={`card-stat-${card.title.toLowerCase().replace(' ', '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid={`text-${card.key}`}>
                  {stats?.[card.key]?.toLocaleString() || 0}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-chart-1" />
              Atividade nos Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commands" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Comandos"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Mensagens"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-chart-3" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {logsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            ) : logs && logs.length > 0 ? (
              logs.slice(0, 5).map((log) => {
                const Icon = activityIcons[log.type] || Terminal;
                return (
                  <div key={log.id} className="flex items-start gap-3" data-testid={`log-${log.id}`}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{log.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.timestamp), { 
                          addSuffix: true,
                          locale: pt 
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tempo Online</p>
              <p className="text-lg font-semibold" data-testid="text-uptime">
                {formatUptime(stats.uptime)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mensagens Processadas</p>
              <p className="text-lg font-semibold" data-testid="text-messages">
                {stats.messagesProcessed.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/30">
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
