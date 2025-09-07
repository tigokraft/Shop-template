import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      <RegisterForm />
    </main>
  );
}
