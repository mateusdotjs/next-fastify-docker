"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";
import { useEffect } from "react";
import Link from "next/link";

const clientSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function ClientesEditarPage() {
  const { id } = useParams();
  const router = useRouter();

  const clientId = Number(id);

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const res = await api.get(`/clients/${clientId}`);
      return res.data;
    },
  });

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "ACTIVE",
    },
  });

  const { register, handleSubmit, control, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (client) {
      reset({
        name: client.name || "",
        email: client.email || "",
        status:
          client.status === "ACTIVE" || client.status === "INACTIVE"
            ? client.status
            : "ACTIVE",
      });
    }
  }, [client, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ClientFormData) =>
      api.put(`/clients/${clientId}`, data),
    onSuccess: () => router.push("/clientes/"),
    onError: () => alert("Erro ao atualizar cliente"),
  });

  const onSubmit = (data: ClientFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Carregando dados...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    id="status"
                    {...field}
                    className="w-full border rounded p-2"
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Button type="submit" disabled={isSubmitting}>
                Salvar Alterações
              </Button>
              <Link href={"/clientes"}>
                <Button variant="outline">Voltar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
