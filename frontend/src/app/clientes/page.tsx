"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AllocationWithAsset, Client } from "@/types";

export default function ClientesListPage() {
  const {
    data: clients,
    isLoading: loadingClients,
    error: errorClients,
  } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await api.get("/clients");
      return res.data;
    },
  });

  const {
    data: allocations,
    isLoading: loadingAllocations,
    error: errorAllocations,
  } = useQuery<AllocationWithAsset[]>({
    queryKey: ["allocations"],
    queryFn: async () => {
      const res = await api.get("/allocations");
      return res.data;
    },
  });

  function getTotalsByClient(clientId: number) {
    if (!allocations) return [];

    // Filtra as alocações que são do client e tem quotas > 0
    const filtered = allocations.filter(
      ({ allocation }) =>
        allocation.clientId === clientId && allocation.quotas > 0
    );

    // Mapa para somar totais por ativo e armazenar quotas
    const totalsMap = new Map<
      number,
      { name: string; quotas: number; totalValue: number }
    >();

    filtered.forEach(({ allocation, asset }) => {
      if (!totalsMap.has(asset.id)) {
        totalsMap.set(asset.id, { name: asset.name, quotas: 0, totalValue: 0 });
      }
      const entry = totalsMap.get(asset.id)!;
      entry.quotas += allocation.quotas;
      entry.totalValue += allocation.quotas * asset.value;
    });

    return Array.from(totalsMap.values());
  }

  if (loadingClients || loadingAllocations) return <p>Carregando...</p>;
  if (errorClients) return <p>Erro ao carregar clientes.</p>;
  if (errorAllocations) return <p>Erro ao carregar alocações.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>

      {clients && clients.length === 0 && <p>Não há clientes registrados</p>}

      {clients &&
        clients.length > 0 &&
        clients.map((client) => {
          const totals = getTotalsByClient(client.id);

          return (
            <Card key={client.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Email: <span className="font-medium">{client.email}</span>
                </p>
                <p>
                  Status:{" "}
                  <span className="capitalize text-sm">
                    {client.status === "ACTIVE" ? "Ativo" : "Inativo"}
                  </span>
                </p>

                {totals.length > 0 && (
                  <div>
                    <h3 className="font-semibold mt-2">
                      Totais alocados por ativo:
                    </h3>
                    <ul className="list-disc list-inside">
                      {totals.map(({ name, quotas, totalValue }) => (
                        <li key={name}>
                          {name}: {quotas.toFixed(2)} cotas | Total: R${" "}
                          {totalValue.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Link href={`/clientes/${client.id}/editar`}>
                    <Button variant="outline">Editar dados do cliente</Button>
                  </Link>
                  <Link href={`/clientes/${client.id}/alocacoes`}>
                    <Button>Alocar ativos</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      <Link href={"/clientes/criar"}>
        <Button className="w-full">+ Cadastrar novo cliente</Button>
      </Link>
    </div>
  );
}
