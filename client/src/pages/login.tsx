import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { OrbitalLogo } from "@/components/orbital-logo";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [_location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        setLocation("/");
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Não foi possível autenticar. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4 text-primary">
            <OrbitalLogo size={80} />
          </div>
          <CardTitle className="text-2xl">OrbitalBot</CardTitle>
          <CardDescription>
            Gerenciador de Bot Discord
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Clique para autenticar com seu bot Discord configurado
          </p>
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            size="lg"
            className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
            data-testid="button-login-discord"
          >
            {isLoading ? "Autenticando..." : "Entrar no Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
