import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ChatSpace
          </h1>
          <p className="text-muted-foreground mt-2">
            Your AI-powered workspace
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
