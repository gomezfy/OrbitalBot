import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, Save, Key } from "lucide-react";
import { type BotSettings, updateBotTokenSchema } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { botSettingsSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { data: settings, isLoading } = useQuery<BotSettings>({
    queryKey: ["/api/settings"],
  });

  const { toast } = useToast();
  const [botToken, setBotToken] = useState("");

  const form = useForm<BotSettings>({
    resolver: zodResolver(botSettingsSchema),
    defaultValues: {
      prefix: "!",
      status: "online",
      activity: "",
      activityType: "playing",
      autoResponse: false,
      loggingEnabled: false,
      moderationEnabled: false,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: BotSettings) => {
      return apiRequest("PUT", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Configurações salvas",
        description: "As configurações do bot foram atualizadas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    },
  });

  const updateTokenMutation = useMutation({
    mutationFn: async (botToken: string) => {
      return apiRequest("POST", "/api/bot/token", { botToken });
    },
    onSuccess: () => {
      setBotToken("");
      toast({
        title: "Token configurado",
        description: "O token do bot Discord foi configurado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível configurar o token. Verifique se o token é válido.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BotSettings) => {
    updateSettingsMutation.mutate(data);
  };

  const onTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = updateBotTokenSchema.safeParse({ botToken });
    if (!validation.success) {
      toast({
        title: "Token inválido",
        description: "O token deve ter pelo menos 50 caracteres.",
        variant: "destructive",
      });
      return;
    }
    updateTokenMutation.mutate(botToken);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-settings-title">Configurações</h1>
        <p className="text-muted-foreground">Personalizar comportamento e aparência do bot</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Básicas</CardTitle>
                <CardDescription>
                  Configure o prefixo e a presença do bot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefixo de Comando</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="!"
                          {...field}
                          data-testid="input-prefix"
                        />
                      </FormControl>
                      <FormDescription>
                        Caractere usado antes dos comandos (ex: !help)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="idle">Ausente</SelectItem>
                          <SelectItem value="dnd">Não Perturbe</SelectItem>
                          <SelectItem value="invisible">Invisível</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Como o bot aparece para os usuários
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividade Personalizada</CardTitle>
                <CardDescription>
                  Configure a mensagem de atividade do bot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Atividade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-activity-type">
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="playing">Jogando</SelectItem>
                          <SelectItem value="watching">Assistindo</SelectItem>
                          <SelectItem value="listening">Ouvindo</SelectItem>
                          <SelectItem value="competing">Competindo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem de Atividade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Minecraft"
                          {...field}
                          data-testid="input-activity"
                        />
                      </FormControl>
                      <FormDescription>
                        Texto exibido junto com o tipo de atividade
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades</CardTitle>
                <CardDescription>
                  Ativar ou desativar recursos do bot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="autoResponse"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <FormLabel>Respostas Automáticas</FormLabel>
                        <FormDescription>
                          Responder automaticamente a mensagens específicas
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-auto-response"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loggingEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <FormLabel>Sistema de Logs</FormLabel>
                        <FormDescription>
                          Registrar todas as atividades do bot
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-logging"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moderationEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <FormLabel>Moderação</FormLabel>
                        <FormDescription>
                          Ativar comandos de moderação automática
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-moderation"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Conexão Discord
                </CardTitle>
                <CardDescription>
                  Configure o token do seu bot Discord
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onTokenSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bot-token">Token do Bot</Label>
                    <Input
                      id="bot-token"
                      type="password"
                      placeholder="Cole seu token Discord aqui"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      data-testid="input-bot-token"
                    />
                    <p className="text-sm text-muted-foreground">
                      Você pode obter o token do seu bot no{" "}
                      <a
                        href="https://discord.com/developers/applications"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Portal de Desenvolvedores do Discord
                      </a>
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={updateTokenMutation.isPending || !botToken}
                    data-testid="button-save-token"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {updateTokenMutation.isPending ? "Salvando..." : "Salvar Token"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
                <CardDescription>
                  Detalhes sobre a configuração atual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Versão do Bot</Label>
                  <p className="text-lg font-semibold">1.0.0</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">API Discord</Label>
                  <p className="text-lg font-semibold">v10</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Última Atualização</Label>
                  <p className="text-lg font-semibold">Agora</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={updateSettingsMutation.isPending}
              data-testid="button-save-settings"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
