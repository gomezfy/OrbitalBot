import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server as ServerIcon, Users, Calendar } from "lucide-react";
import { type Server } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default function ServersPage() {
  const { data: servers, isLoading } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
  });

  const statusColors = {
    online: "bg-chart-2 text-chart-2",
    offline: "bg-muted-foreground text-muted-foreground",
    error: "bg-destructive text-destructive",
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-servers-title">Servidores</h1>
        <p className="text-muted-foreground">Gerenciar servidores conectados ao bot</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : servers && servers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <Card key={server.id} data-testid={`card-server-${server.id}`} className="hover-elevate">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={server.icon || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {server.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{server.name}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 ${statusColors[server.status]}/10 border-${statusColors[server.status]}/30`}
                  >
                    {server.status === 'online' ? 'Online' : server.status === 'offline' ? 'Offline' : 'Erro'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Membros:</span>
                  <span className="font-medium" data-testid={`text-members-${server.id}`}>
                    {server.memberCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Entrou:</span>
                  <span className="font-medium">
                    {format(new Date(server.joinedAt), "dd MMM yyyy", { locale: pt })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ServerIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Servidor Conectado</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Seu bot ainda não foi adicionado a nenhum servidor. Adicione o bot a um servidor para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
