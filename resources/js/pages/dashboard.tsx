import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, Clock, Copy, Eye, EyeOff, Key, Mail, MapPin, Package, Phone, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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
    isNewUser?: boolean;
    userData?: {
        name: string;
        email: string;
        nombre_empresa: string;
        celular: string;
        tipo: string;
        password?: string;
    };
}

export default function Dashboard({ pedidos, isNewUser = false, userData }: DashboardProps) {
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
    const [credentialsModalOpen, setCredentialsModalOpen] = useState(isNewUser);
    const [showPassword, setShowPassword] = useState(false);

    // Mostrar modal de credenciales solo si es nuevo usuario y tiene datos
    useEffect(() => {
        if (isNewUser && userData) {
            setCredentialsModalOpen(true);
        }
    }, [isNewUser, userData]);

    // Función para copiar texto al portapapeles
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        // Podrías agregar un toast notification aquí si tienes ese componente
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Administrador" />

            {totalOrders >= 50 && (
                <div className="mx-4 mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 md:mx-8 dark:border-amber-800 dark:bg-amber-900/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                                <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Límite de pedidos alcanzado</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    Has cumplido con los 50 pedidos permitidos. Adquiere nuestros planes de catálogo o uno general del sistema con
                                    muchas más funcionalidades.
                                </p>
                            </div>
                        </div>
                        <Button asChild size="sm">
                            <a href="https://miracode.tech/precios/" target="_blank" rel="noreferrer">
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
                            <ShoppingBag className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Bs. {totalSales.toFixed(2)}</div>
                            <p className="text-muted-foreground text-xs">Ingresos brutos acumulados</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pedidos Recibidos</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-muted-foreground text-xs">Órdenes totales registradas</p>
                        </CardContent>
                    </Card>
                    {/* Add more stats as needed */}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Pedidos Recientes</h2>
                        <Button variant="outline" size="sm">
                            Ver todos
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {pedidos.length > 0 ? (
                            pedidos.map((pedido) => (
                                <Card key={pedido.id} className="hover:border-primary/50 overflow-hidden transition-colors">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="flex-1 p-6">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold">{pedido.cliente}</h3>
                                                        <p className="text-muted-foreground text-xs">
                                                            Pedido realizado el {new Date(pedido.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                                    Nuevo
                                                </Badge>
                                            </div>

                                            <div className="mb-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                                                <div className="text-muted-foreground flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    {pedido.celular}
                                                </div>
                                                <div className="text-muted-foreground flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {pedido.departamento}, {pedido.pais}
                                                </div>
                                                <div className="text-primary flex items-center gap-2 font-bold">
                                                    <ShoppingBag className="h-4 w-4" />
                                                    Bs. {Number(pedido.total).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="space-y-2 border-t pt-4">
                                                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">Productos</p>
                                                {pedido.productos.map((prod) => (
                                                    <div key={prod.id} className="flex items-center justify-between text-sm">
                                                        <span>
                                                            {prod.pivot.cantidad}x {prod.nombre}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            Bs. {(prod.precio * prod.pivot.cantidad).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-muted/30 flex flex-col justify-center gap-2 border-t p-6 md:w-48 md:border-t-0 md:border-l">
                                            <Button size="sm" className="w-full gap-2" onClick={() => setOrderPlanModalOpen(true)}>
                                                <CheckCircle2 className="h-4 w-4" /> Procesar
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="group w-full gap-2"
                                                onClick={() => setOrderPlanModalOpen(true)}
                                            >
                                                Detalles <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-dashed py-12">
                                <div className="text-center">
                                    <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-20" />
                                    <h3 className="text-lg font-medium">No hay pedidos registrados</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Tus ventas aparecerán aquí una vez que los clientes realicen pedidos.
                                    </p>
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
                        <div className="text-muted-foreground space-y-4 text-sm">
                            <p>Este plan te permite administrar y procesar pedidos directamente desde tu panel.</p>
                            <p>También puedes elegir otros planes para obtener más funcionalidades y crecimiento en tu tienda.</p>
                        </div>
                        <DialogFooter className="flex flex-col gap-2">
                            <Button asChild className="w-full">
                                <a href="https://miracode.tech/precios" target="_blank" rel="noreferrer">
                                    Ver planes
                                </a>
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => setOrderPlanModalOpen(false)}>
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* 🔐 Modal de Credenciales para Nuevo Usuario */}
                <Dialog open={credentialsModalOpen} onOpenChange={setCredentialsModalOpen}>
                    <DialogContent className="rounded-2xl border-none shadow-2xl sm:max-w-[500px]">
                        <DialogHeader className="pb-2 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/25">
                                <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">¡Bienvenido! 🎉</DialogTitle>
                            <DialogDescription className="text-muted-foreground">Tu cuenta ha sido creada exitosamente</DialogDescription>
                        </DialogHeader>

                        {/* ⚠️ Alerta destacada de credenciales */}
                        <div className="my-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/40">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-800">
                                    <Key className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold tracking-wide text-amber-800 uppercase dark:text-amber-200">
                                        📸 ¡Toma nota de tus credenciales!
                                    </p>
                                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                                        Estas son tus credenciales para iniciar sesión.{' '}
                                        <strong>Tómale una captura de pantalla o guárdalas en un lugar seguro</strong>, ya que no podrás volver a ver
                                        tu contraseña.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 📋 Datos del usuario */}
                        {userData && (
                            <div className="space-y-3 py-2">
                                {/* Email */}
                                <div className="bg-muted/40 flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs font-medium">Correo electrónico</p>
                                            <p className="font-semibold text-zinc-900 dark:text-white">{userData.email}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                {/* Contraseña con toggle alineado a la derecha */}
                                <div className="bg-muted/40 relative flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                                            <Key className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs font-medium">Contraseña</p>
                                            <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                                                {showPassword ? userData?.password || '••••••••' : '••••••••'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Toggle de visibilidad alineado a la derecha (igual que el botón de copiar) */}
                                    {userData?.password && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-muted-foreground hover:text-foreground focus:ring-primary absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-0.5 transition-colors focus:ring-2 focus:outline-none"
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            title={showPassword ? 'Ocultar' : 'Mostrar'}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <DialogFooter className="flex flex-col gap-2 pt-2">
                            <Button
                                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                                onClick={() => setCredentialsModalOpen(false)}
                            >
                                ¡Entendido, ir al dashboard!
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
