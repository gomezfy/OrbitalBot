import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Terminal, UserPlus, UserMinus, AlertCircle, Settings } from "lucide-react";
import { type ActivityLog } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { pt } from "date-fns/locale";

const activityIcons = {
  command: Terminal,
  join: UserPlus,
  leave: UserMinus,
  error: AlertCircle,
  config: Settings,
};

const activityColors = {
  command: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  join: "bg-chart-2/10 text-chart-2 border-chart-2/30",
  leave: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  error: "bg-destructive/10 text-destructive border-destructive/30",
  config: "bg-chart-3/10 text-chart-3 border-chart-3/30",
};

const activityLabels = {
  command: "Comando",
  join: "Entrada",
  leave: "Saída",
  error: "Erro",
  config: "Configuração",
};

export default function LogsPage() {
  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/logs"],
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-logs-title">Logs de Atividade</h1>
        <p className="text-muted-foreground">Histórico completo de eventos do bot</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : logs && logs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" />
              Todas as Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-0.5 bg-border" />
              <div className="space-y-6">
                {logs.map((log, index) => {
                  const Icon = activityIcons[log.type] || Terminal;
                  return (
                    <div
                      key={log.id}
                      className="relative flex items-start gap-4"
                      data-testid={`log-item-${log.id}`}
                    >
                      <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                        log.type === 'error' ? 'bg-destructive/10' : 'bg-primary/10'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          log.type === 'error' ? 'text-destructive' : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium" data-testid={`text-description-${log.id}`}>
                              {log.description}
                            </p>
                            {log.details && (
                              <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="outline" className={activityColors[log.type]}>
                                {activityLabels[log.type]}
                              </Badge>
                              {log.serverName && (
                                <Badge variant="outline" className="text-xs">
                                  {log.serverName}
                                </Badge>
                              )}
                              {log.username && (
                                <Badge variant="outline" className="text-xs">
                                  {log.username}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                            <span>{format(new Date(log.timestamp), "dd/MM/yyyy", { locale: pt })}</span>
                            <span>{format(new Date(log.timestamp), "HH:mm:ss", { locale: pt })}</span>
                            <span className="text-xs">
                              {formatDistanceToNow(new Date(log.timestamp), {
                                addSuffix: true,
                                locale: pt,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ScrollText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Log Disponível</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Os logs de atividade do bot aparecerão aqui quando houver eventos registrados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
