import { LoginForm } from "@/components/auth/auth-forms";
import { Card, PageHeader } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <PageHeader
        title="Вхід"
        description="Увійди, щоб бачити лише свої вакансії, профіль і листи."
      />
      <Card className="mx-auto max-w-md">
        <LoginForm />
        <p className="mt-4 text-sm text-muted">
          Немає акаунта?{" "}
          <Link
            href="/register"
            className="font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Зареєструватися
          </Link>
        </p>
      </Card>
    </>
  );
}
