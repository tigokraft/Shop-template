import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <LoginForm />
    </main>
  );
}
