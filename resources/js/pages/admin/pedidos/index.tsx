import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BadgeDollarSign, Search, Store, Calendar, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface Empresa {
    id: number;
    nombre_empresa: string;
    slug: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: string | number;
    pivot?: {
        cantidad: number;
    };
}

interface Pedido {
    id: number;
    cliente: string;
    celular: string;
    departamento: string | null;
    pais: string | null;
    total: number | string | null;
    created_at: string;
    empresa?: Empresa;
    productos?: Producto[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    pedidos: {
        data: Pedido[];
        links: PaginationLink[];
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
    };
}

export default function AdminPedidos({ pedidos, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('admin.pedidos.index'), { search }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pedidos Globales', href: '/admin/pedidos' }]}>
            <Head title="Pedidos Globales - Administrador" />
            
            <div className="flex-1 w-full p-4 md:p-8 space-y-8 bg-zinc-50/50 dark:bg-zinc-950/50">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                            <BadgeDollarSign className="h-8 w-8 text-steel-blue-600" /> Historial de Pedidos Global
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Visualiza y audita todas las transacciones generadas en la plataforma.</p>
                    </div>
                </header>

                <Card className="border-steel-blue-100 dark:border-zinc-800 shadow-xl shadow-steel-blue-900/5 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white dark:bg-zinc-900 pb-4 border-b border-zinc-100 dark:border-zinc-800 px-6 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <span>Lista Consolidada</span>
                            <Badge variant="secondary" className="bg-steel-blue-100 text-steel-blue-800">
                                {pedidos.total} Registros
                            </Badge>
                        </CardTitle>
                        
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input 
                                placeholder="Buscar por cliente, empresa o celular..." 
                                className="pl-9 rounded-xl border-zinc-200 focus-visible:ring-steel-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-zinc-900">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 border-zinc-100 dark:border-zinc-800">
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 pl-6">ID / Fecha</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Cliente</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Contacto</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Resumen</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 text-right pr-6">Tienda (Empresa)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pedidos.data.map((pedido) => (
                                        <TableRow key={pedido.id} className="group border-zinc-100 dark:border-zinc-800">
                                            <TableCell className="pl-6">
                                                <div className="font-bold text-steel-blue-600 dark:text-steel-blue-400">#ORD-{pedido.id.toString().padStart(4, '0')}</div>
                                                <div className="text-xs text-zinc-500 flex items-center mt-1">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(pedido.created_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-zinc-800 dark:text-zinc-200">{pedido.cliente}</div>
                                                {(pedido.departamento || pedido.pais) && (
                                                    <div className="text-xs text-zinc-500 font-medium">
                                                        {pedido.departamento}{pedido.departamento && pedido.pais ? ', ' : ''}{pedido.pais}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-zinc-600 font-medium whitespace-nowrap">
                                                    <Phone className="w-3 h-3 mr-1.5 text-zinc-400" />
                                                    {pedido.celular}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    {pedido.productos ? pedido.productos.length : 0} items
                                                </div>
                                                {pedido.total && (
                                                    <div className="font-bold text-green-600 text-sm">
                                                        Bs {pedido.total}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {pedido.empresa ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="font-bold text-steel-blue-700 dark:text-steel-blue-300">{pedido.empresa.nombre_empresa}</span>
                                                        <div className="h-8 w-8 rounded-lg outline outline-1 outline-steel-blue-200 bg-steel-blue-50 dark:bg-zinc-800 flex items-center justify-center">
                                                            <Store className="h-4 w-4 text-steel-blue-600 dark:text-steel-blue-400" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-400 italic text-sm font-medium">Dato Extraviado</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {pedidos.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-16 text-muted-foreground font-medium text-lg">
                                                No se encontraron pedidos con esos filtros.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {pedidos.links && pedidos.links.length > 3 && (
                            <div className="py-4 px-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <div className="text-sm text-zinc-500 font-medium hidden md:block">
                                    Mostrando {pedidos.from || 0} a {pedidos.to || 0} de {pedidos.total}
                                </div>
                                <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                                    {pedidos.links.map((link, i) => (
                                        link.url ? (
                                            <Link 
                                                key={i} 
                                                href={link.url}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${link.active ? 'bg-steel-blue-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span 
                                                key={i} 
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-400 cursor-not-allowed whitespace-nowrap"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
