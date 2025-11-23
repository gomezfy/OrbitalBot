import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Plus, TrendingUp } from "lucide-react";
import { type Command } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

export default function CommandsPage() {
  const { data: commands, isLoading } = useQuery<Command[]>({
    queryKey: ["/api/commands"],
  });

  const { toast } = useToast();

  const toggleCommandMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      return apiRequest("PATCH", `/api/commands/${id}`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commands"] });
      toast({
        title: "Comando atualizado",
        description: "O estado do comando foi alterado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o comando.",
        variant: "destructive",
      });
    },
  });

  const categories = commands
    ? Array.from(new Set(commands.map((cmd) => cmd.category)))
    : [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-commands-title">Comandos</h1>
          <p className="text-muted-foreground">Gerenciar comandos disponíveis do bot</p>
        </div>
        <Button data-testid="button-add-command">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Comando
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : commands && commands.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Comandos</CardTitle>
                <Terminal className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{commands.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comandos Ativos</CardTitle>
                <Terminal className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {commands.filter((cmd) => cmd.enabled).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uso Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {commands.reduce((sum, cmd) => sum + cmd.usageCount, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {categories.map((category) => {
            const categoryCommands = commands.filter((cmd) => cmd.category === category);
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Comando</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Uso</TableHead>
                        <TableHead className="text-right">Último Uso</TableHead>
                        <TableHead className="text-center">Ativo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryCommands.map((command) => (
                        <TableRow key={command.id} data-testid={`row-command-${command.id}`}>
                          <TableCell className="font-mono font-medium">
                            /{command.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {command.description}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" data-testid={`text-usage-${command.id}`}>
                              {command.usageCount.toLocaleString()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {command.lastUsed
                              ? formatDistanceToNow(new Date(command.lastUsed), {
                                  addSuffix: true,
                                  locale: pt,
                                })
                              : "Nunca"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={command.enabled}
                              onCheckedChange={(checked) =>
                                toggleCommandMutation.mutate({
                                  id: command.id,
                                  enabled: checked,
                                })
                              }
                              data-testid={`switch-command-${command.id}`}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Terminal className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Comando Configurado</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Adicione comandos para que seu bot possa responder a interações dos usuários.
            </p>
            <Button data-testid="button-add-first-command">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Comando
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
