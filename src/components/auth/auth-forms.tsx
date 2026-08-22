"use client";

import { login, register, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { useActionState } from "react";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@gmail.com"
        />
      </Field>
      <Field label="Пароль" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <FormMessage error={state?.error} />
      <Button disabled={pending}>{pending ? "Входжу…" : "Увійти"}</Button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    register,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@gmail.com"
        />
      </Field>
      <Field label="Пароль" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Щонайменше 8 символів"
        />
      </Field>
      <Field label="Повтори пароль" htmlFor="confirm">
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </Field>
      <FormMessage error={state?.error} />
      <Button disabled={pending}>
        {pending ? "Створюю акаунт…" : "Зареєструватися"}
      </Button>
    </form>
  );
}
