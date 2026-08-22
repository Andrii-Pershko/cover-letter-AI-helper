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
      <Card className="mx-auto max-w-md">
        <RegisterForm />
        <p className="mt-4 text-sm text-muted">
          Вже є акаунт?{" "}
          <Link
            href="/login"
            className="font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Увійти
          </Link>
        </p>
      </Card>
    </>
  );
}
