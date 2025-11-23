import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { OrbitalLogo } from "@/components/orbital-logo";

export default function LoginPage() {
  const [_location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) {
      handleCallback();
    }
  }, []);

  const handleCallback = async () => {
    try {
      const response = await fetch("/api/auth/callback" + window.location.search);
      if (response.ok) {
        setLocation("/");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/auth/discord";
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
            Faça login com sua conta Discord para gerenciar seu bot
          </p>
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            size="lg"
            className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
            data-testid="button-login-discord"
          >
            {isLoading ? "Conectando..." : "Conectar com Discord"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
