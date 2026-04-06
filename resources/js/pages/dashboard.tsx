import { Head, usePage } from '@inertiajs/react';
import { Package, Clock, User, Phone, MapPin, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    pivot: {
        cantidad: number;
    };
}

interface Pedido {
    id: number;
    cliente: string;
    celular: string;
    departamento: string;
    pais: string;
    total: number;
    created_at: string;
    productos: Producto[];
}

interface DashboardProps {
    pedidos: Pedido[];
}

export default function Dashboard({ pedidos }: DashboardProps) {
    const { tenant } = usePage().props as { tenant?: { slug?: string } };
    const slug = tenant?.slug || '';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: `/${slug}/dashboard`,
        },
    ];
    const totalSales = pedidos.reduce((acc, p) => acc + Number(p.total), 0);
    const totalOrders = pedidos.length;
    const [orderPlanModalOpen, setOrderPlanModalOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Administrador" />
            
            {totalOrders >= 50 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 mx-4 md:mx-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                                <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Límite de pedidos alcanzado</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    Has cumplido con los 50 pedidos permitidos. Adquiere nuestros planes de catálogo o uno general del sistema con muchas más funcionalidades.
                                </p>
                            </div>
                        </div>
                        <Button asChild size="sm">
                            <a href="https://miracode.tech/1bs/" target="_blank" rel="noreferrer">
                                Ver planes
                            </a>
                        </Button>
                    </div>
                </div>
            )}
            
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Bs. {totalSales.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Ingresos brutos acumulados</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pedidos Recibidos</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">Órdenes totales registradas</p>
                        </CardContent>
                    </Card>
                    {/* Add more stats as needed */}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Pedidos Recientes</h2>
                        <Button variant="outline" size="sm">Ver todos</Button>
                    </div>

                    <div className="grid gap-4">
                        {pedidos.length > 0 ? (
                            pedidos.map((pedido) => (
                                <Card key={pedido.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="flex-1 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold">{pedido.cliente}</h3>
                                                        <p className="text-xs text-muted-foreground">Pedido realizado el {new Date(pedido.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                                    Nuevo
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    {pedido.celular}
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    {pedido.departamento}, {pedido.pais}
                                                </div>
                                                <div className="flex items-center gap-2 font-bold text-primary">
                                                    <ShoppingBag className="h-4 w-4" />
                                                    Bs. {Number(pedido.total).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="space-y-2 border-t pt-4">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Productos</p>
                                                {pedido.productos.map((prod) => (
                                                    <div key={prod.id} className="flex justify-between items-center text-sm">
                                                        <span>{prod.pivot.cantidad}x {prod.nombre}</span>
                                                        <span className="text-muted-foreground">Bs. {(prod.precio * prod.pivot.cantidad).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-muted/30 md:w-48 p-6 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l">
                                            <Button size="sm" className="w-full gap-2" onClick={() => setOrderPlanModalOpen(true)}>
                                                <CheckCircle2 className="h-4 w-4" /> Procesar
                                            </Button>
                                            <Button variant="ghost" size="sm" className="w-full gap-2 group" onClick={() => setOrderPlanModalOpen(true)}>
                                                Detalles <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-dashed py-12">
                                <div className="text-center">
                                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                    <h3 className="text-lg font-medium">No hay pedidos registrados</h3>
                                    <p className="text-muted-foreground text-sm">Tus ventas aparecerán aquí una vez que los clientes realicen pedidos.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                <Dialog open={orderPlanModalOpen} onOpenChange={setOrderPlanModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Administrar pedidos</DialogTitle>
                            <DialogDescription>
                                Si quieres gestionar tus pedidos en vivo, adquiere el plan <strong>Live-Cuaderno</strong>.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                Este plan te permite administrar y procesar pedidos directamente desde tu panel.
                            </p>
                            <p>
                                También puedes elegir otros planes para obtener más funcionalidades y crecimiento en tu tienda.
                            </p>
                        </div>
                        <DialogFooter className="flex flex-col gap-2">
                            <Button asChild className="w-full">
                                <a href="https://miracode.tech/1bs/" target="_blank" rel="noreferrer">
                                    Ver planes
                                </a>
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => setOrderPlanModalOpen(false)}>
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
