import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold" data-testid="text-tos-title">
              Termos de Serviço
            </h1>
            <p className="text-muted-foreground">OrbitalBot - Dashboard de Gerenciamento de Bots Discord</p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Aceitação dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Ao acessar e usar o OrbitalBot ("Serviço"), você aceita estar vinculado por estes Termos de Serviço. 
                Se você não concorda com qualquer parte destes termos, você não tem permissão para usar o Serviço.
              </p>
              <p>
                O OrbitalBot é fornecido "no estado em que se encontra" sem garantias de qualquer tipo, explícitas ou implícitas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Descrição do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                O OrbitalBot é um dashboard web para gerenciar bots Discord. O Serviço permite que você:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Monitorar estatísticas e atividades do seu bot</li>
                <li>Gerenciar servidores (guilds) conectados</li>
                <li>Configurar e controlar comandos</li>
                <li>Visualizar logs de atividades</li>
                <li>Personalizar configurações do bot</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Propriedade e Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Apenas o proprietário do bot Discord pode:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Configurar o token do bot</li>
                <li>Modificar configurações do bot</li>
                <li>Criar, editar ou deletar comandos</li>
                <li>Alterar permissões e comportamentos</li>
              </ul>
              <p className="mt-4">
                O Serviço verifica automaticamente se você é o proprietário do bot antes de permitir modificações. 
                Tentativas não autorizadas são bloqueadas e registradas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Autenticação Discord</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                O OrbitalBot utiliza autenticação OAuth2 do Discord. Ao fazer login, você concorda que:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Você permite que coletemos seu ID do Discord e informações públicas</li>
                <li>As informações serão usadas apenas para autenticação e gerenciamento de acesso</li>
                <li>Você está fazendo login em sua própria conta Discord</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Token do Bot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Você é responsável pela confidencialidade e segurança do token do seu bot Discord. Você concorda que:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Você mantém o token seguro e nunca o compartilha publicamente</li>
                <li>Se o token for comprometido, você regenerará imediatamente no Discord</li>
                <li>O OrbitalBot não é responsável pelo uso não autorizado do token</li>
                <li>Você nunca armazenará o token em repositórios públicos</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Limitações de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                O OrbitalBot não será responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Perda de dados ou configurações</li>
                <li>Interrupções no serviço</li>
                <li>Erros ou bugs na funcionalidade</li>
                <li>Danos causados pelo uso indevido</li>
                <li>Ações de bots ou usuários do Discord</li>
                <li>Alterações nas APIs do Discord</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Conformidade com Discord</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Ao usar o OrbitalBot, você concorda em cumprir:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Termos de Serviço do Discord</li>
                <li>Diretrizes de Políticas do Discord</li>
                <li>Termos da API do Discord</li>
                <li>Todas as leis e regulamentações aplicáveis</li>
              </ul>
              <p className="mt-4">
                O OrbitalBot não é afiliado, endossado ou autorizado pelo Discord, Inc.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Condutas Proibidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Você concorda em não:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Usar o Serviço para fins ilícitos ou prejudiciais</li>
                <li>Tentar hackear, burlar ou contornar a segurança</li>
                <li>Abusar, assediar ou ameaçar outros usuários</li>
                <li>Distribuir conteúdo malicioso ou prejudicial</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Criar spam ou conteúdo ofensivo</li>
                <li>Usar bots para automação não autorizada</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Dados e Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                O OrbitalBot coleta apenas dados necessários para operação:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ID do Discord e informações públicas do perfil</li>
                <li>Configurações e logs do bot</li>
                <li>Sessões de autenticação</li>
              </ul>
              <p className="mt-4">
                Seus dados não serão compartilhados com terceiros sem consentimento. 
                Para mais informações, consulte nossa Política de Privacidade.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Modificações do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                O OrbitalBot se reserva o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modificar ou interromper o Serviço a qualquer momento</li>
                <li>Atualizar estes Termos de Serviço</li>
                <li>Fazer melhorias e correções</li>
                <li>Remover recursos ou funcionalidades</li>
              </ul>
              <p className="mt-4">
                As modificações serão efetivas imediatamente após a publicação.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Encerramento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                O OrbitalBot pode encerrar sua conta ou acesso se:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Você violar estes Termos de Serviço</li>
                <li>Você cometer abuso ou comportamento prejudicial</li>
                <li>O Serviço for descontinuado</li>
                <li>Determinarmos que é necessário por segurança</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Isenção de Garantias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                O SERVIÇO É FORNECIDO "NO ESTADO EM QUE SE ENCONTRA" SEM QUALQUER GARANTIA. 
                O ORBITALBOPT NÃO GARANTE:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Que o Serviço será ininterrupto ou sem erros</li>
                <li>Que erros serão corrigidos</li>
                <li>Que o Serviço atenderá suas necessidades</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                EM NENHUMA CIRCUNSTÂNCIA O ORBITALBOPT SERÁ RESPONSÁVEL POR DANOS INDIRETOS, 
                INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS, INCLUINDO MAS NÃO LIMITADO A:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Perda de dados ou receita</li>
                <li>Lucros perdidos ou cessante</li>
                <li>Danos a propriedade</li>
                <li>Qualquer outro dano resultante do uso do Serviço</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Através do Discord: OrbitalBot Support</li>
                <li>Abra uma issue no repositório do projeto</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>15. Lei Aplicável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                Estes Termos de Serviço são regidos pelas leis em vigor no local onde o Serviço é operado, 
                sem considerar conflitos de disposições legais.
              </p>
            </CardContent>
          </Card>

          {/* Final Note */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                Ao usar o OrbitalBot, você reconhece que leu, compreendeu e concorda com todos estes Termos de Serviço.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/">
            <Button variant="outline" data-testid="button-back-to-home">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
