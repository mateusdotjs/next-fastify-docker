"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import Link from "next/link";
import { AllocationWithAsset, Asset } from "@/types";
import { AxiosError } from "axios";

const allocationSchema = z.object({
  assetId: z.number(),
  quotas: z.number().min(0),
});

type AllocationFormData = z.infer<typeof allocationSchema>;

export default function Alocacoes() {
  const params = useParams();
  const clientId = Number(params.id);
  const queryClient = useQueryClient();

  // Buscar cliente
  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const res = await api.get(`/clients/${clientId}`);
      return res.data;
    },
  });

  // Buscar allocations no formato [{ allocation, asset }]
  const { data } = useQuery({
    queryKey: ["allocations", clientId],
    queryFn: async () => {
      const res = await api.get(`/allocations/${clientId}`);
      return res.data;
    },
  });

  const allocations = Array.isArray(data) ? data : [];

  // Buscar assets (para o select)
  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await api.get("/assets");
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AllocationFormData>({
    resolver: zodResolver(allocationSchema),
  });

  const selectedAssetId = watch("assetId");

  // Função para pegar allocation.id baseado no assetId selecionado
  function findAllocationIdByAssetId(assetId: number) {
    const found = allocations.find(
      (item: AllocationWithAsset) => item.asset.id === assetId
    );
    return found ? found.allocation.id : null;
  }

  const mutation = useMutation({
    mutationFn: async (data: AllocationFormData) => {
      if (data.quotas === 0) {
        // Pega o id da allocation que tem o assetId selecionado
        const allocationId = findAllocationIdByAssetId(data.assetId);
        if (!allocationId) return;
        return api.delete(`/allocations/${allocationId}`);
      } else {
        return api.post(`/allocations/${clientId}`, { ...data, clientId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations", clientId] });
      reset();
    },
    onError: (error: AxiosError) =>
      alert(error?.message || "Erro ao criar ou remover alocação"),
  });

  const onSubmit = (data: AllocationFormData) => mutation.mutate(data);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Alocações do Cliente: {client?.name || "Carregando..."}
      </h1>

      <div className="space-y-4">
        {allocations.length > 0 ? (
          allocations.map((item: AllocationWithAsset, i: number) => (
            <Card key={i}>
              <CardContent className="p-4">
                <CardTitle>{item.asset.name}</CardTitle>
                <CardDescription>
                  Valor: R$ {item.asset.value.toFixed(2)}
                  <br />
                  Cotas alocadas: {item.allocation.quotas.toFixed(2)}
                </CardDescription>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Sem alocações para mostrar</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Ativo</Label>
          <Select
            value={selectedAssetId !== undefined ? String(selectedAssetId) : ""}
            onValueChange={(value) =>
              setValue("assetId", Number(value), {
                shouldValidate: true,
                shouldTouch: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um ativo" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset: Asset) => (
                <SelectItem key={asset.id} value={String(asset.id)}>
                  {asset.name} - R$ {asset.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assetId && (
            <p className="text-red-500 text-sm">{errors.assetId.message}</p>
          )}
        </div>

        <div>
          <Label>Quantidade de cotas:</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Ex: 10"
            {...register("quotas", { valueAsNumber: true })}
          />
          {errors.quotas && (
            <p className="text-red-500 text-sm">{errors.quotas.message}</p>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button type="submit" disabled={isSubmitting}>
            Alocar
          </Button>
          <Link href={"/clientes"}>
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
