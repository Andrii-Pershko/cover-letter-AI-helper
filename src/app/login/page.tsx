import { AuthIntro } from "@/components/auth/auth-intro";
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:items-start lg:gap-8">
        <AuthIntro />
        <Card className="order-first lg:order-none">
          <LoginForm />
          <p className="mt-4 text-sm text-muted">
            Немає акаунта?{" "}
            <Link
              href="/register"
              className="cursor-pointer font-medium text-accent transition-colors hover:text-accent-hover"
            >
              Зареєструватися
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
