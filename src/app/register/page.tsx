import { AuthIntro } from "@/components/auth/auth-intro";
import { RegisterForm } from "@/components/auth/auth-forms";
import { Card, PageHeader } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        title="Реєстрація"
        description="Кожен користувач має свій профіль, кейси, ідеальні листи й історію аналізів."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)] lg:items-start lg:gap-8">
        <AuthIntro />
        <Card className="order-first lg:order-none">
          <RegisterForm />
          <p className="mt-4 text-sm text-muted">
            Вже є акаунт?{" "}
            <Link
              href="/login"
              className="cursor-pointer font-medium text-accent transition-colors hover:text-accent-hover"
            >
              Увійти
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
