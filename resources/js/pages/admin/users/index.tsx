import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Package, Trash2, ShieldAlert, CheckCircle2, XCircle, ShieldCheck, LogOut, Users, Store, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Empresa {
    id: number;
    nombre_empresa: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    empresa?: Empresa;
}

interface PageProps {
    users: User[];
    stats: {
        total_users: number;
        active_users: number;
        total_empresas: number;
        total_productos: number;
        total_pedidos: number;
    };
}

export default function AdminUsers({ users, stats }: PageProps) {
    const { post, delete: destroy, processing } = useForm();

    const handleToggle = (user: User) => {
        post(route('admin.users.toggle', { user: user.id }), {
            preserveScroll: true,
        });
    };

    const handleDelete = (user: User) => {
        if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}? Esta acción no se puede deshacer y también eliminará sus tiendas.`)) {
            destroy(route('admin.users.destroy', { user: user.id }), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel Principal', href: '/admin/users' }]}>
            <Head title="Panel de Administrador - ShopFree" />
            
            <div className="flex-1 w-full p-4 md:p-8 space-y-8 bg-zinc-50/50 dark:bg-zinc-950/50">
                <header>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-steel-blue-600" /> Administración Global
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Gestiona todos los usuarios, tiendas y datos generales de la plataforma.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-steel-blue-100 dark:border-zinc-800 shadow-lg shadow-steel-blue-900/5 rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white dark:bg-zinc-900">
                            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Usuarios Totales</CardTitle>
                            <Users className="h-5 w-5 text-steel-blue-500" />
                        </CardHeader>
                        <CardContent className="bg-white dark:bg-zinc-900">
                            <div className="text-4xl font-black text-zinc-900 dark:text-white">{stats.total_users}</div>
                            <p className="text-xs text-zinc-500 mt-1 font-medium">{stats.active_users} cuentas activas</p>
                        </CardContent>
                    </Card>

                    <Card className="border-steel-blue-100 dark:border-zinc-800 shadow-lg shadow-steel-blue-900/5 rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white dark:bg-zinc-900">
                            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Tiendas</CardTitle>
                            <Store className="h-5 w-5 text-steel-blue-500" />
                        </CardHeader>
                        <CardContent className="bg-white dark:bg-zinc-900">
                            <div className="text-4xl font-black text-zinc-900 dark:text-white">{stats.total_empresas}</div>
                            <p className="text-xs text-zinc-500 mt-1 font-medium">Empresas registradas</p>
                        </CardContent>
                    </Card>

                    <Card className="border-steel-blue-100 dark:border-zinc-800 shadow-lg shadow-steel-blue-900/5 rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white dark:bg-zinc-900">
                            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Productos</CardTitle>
                            <ShoppingBag className="h-5 w-5 text-steel-blue-500" />
                        </CardHeader>
                        <CardContent className="bg-white dark:bg-zinc-900">
                            <div className="text-4xl font-black text-zinc-900 dark:text-white">{stats.total_productos}</div>
                            <p className="text-xs text-zinc-500 mt-1 font-medium">Publicados en el catálogo</p>
                        </CardContent>
                    </Card>

                    <Card className="border-steel-blue-100 dark:border-zinc-800 shadow-lg shadow-steel-blue-900/5 rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white dark:bg-zinc-900">
                            <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Pedidos</CardTitle>
                            <ShoppingCart className="h-5 w-5 text-steel-blue-500" />
                        </CardHeader>
                        <CardContent className="bg-white dark:bg-zinc-900">
                            <div className="text-4xl font-black text-zinc-900 dark:text-white">{stats.total_pedidos}</div>
                            <p className="text-xs text-zinc-500 mt-1 font-medium">Pedidos realizados</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-steel-blue-100 dark:border-zinc-800 shadow-xl shadow-steel-blue-900/5 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white dark:bg-zinc-900 pb-4 border-b border-zinc-100 dark:border-zinc-800 px-8 pt-8">
                        <CardTitle className="text-xl font-bold flex items-center justify-between">
                            <span>Usuarios Registrados</span>
                            <Badge variant="secondary" className="bg-steel-blue-100 text-steel-blue-800 hover:bg-steel-blue-200">{users.length} Total</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 bg-white dark:bg-zinc-900">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 border-zinc-100 dark:border-zinc-800">
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 pl-8">Usuario</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Email</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Tienda (Empresa)</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 text-center">Estado</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 text-right pr-8">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} className="group border-zinc-100 dark:border-zinc-800">
                                            <TableCell className="font-bold text-zinc-800 dark:text-zinc-200 pl-8">
                                                {user.name}
                                                {user.email === 'admin@admin.com' && (
                                                    <Badge variant="outline" className="ml-3 text-[10px] uppercase font-black bg-steel-blue-50 text-steel-blue-700 border-steel-blue-200">Super Admin</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-zinc-500 font-medium">{user.email}</TableCell>
                                            <TableCell>
                                                {user.empresa ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-lg bg-steel-blue-50 dark:bg-zinc-800 flex items-center justify-center">
                                                            <Package className="h-4 w-4 text-steel-blue-600 dark:text-steel-blue-400" />
                                                        </div>
                                                        <span className="font-bold text-steel-blue-700 dark:text-steel-blue-300">{user.empresa.nombre_empresa}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-400 italic text-sm font-medium">Sin tienda</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={user.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none font-bold' : 'bg-red-100 text-red-700 hover:bg-red-200 border-none font-bold'}>
                                                    {user.is_active ? 'Activo' : 'Bloqueado'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                {user.email !== 'admin@admin.com' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            variant={user.is_active ? 'outline' : 'default'} 
                                                            size="sm" 
                                                            onClick={() => handleToggle(user)}
                                                            className={`rounded-xl font-bold ${!user.is_active ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-zinc-600 border-zinc-200'}`}
                                                            disabled={processing}
                                                        >
                                                            {user.is_active ? <XCircle className="h-4 w-4 mr-1.5" /> : <CheckCircle2 className="h-4 w-4 mr-1.5" />}
                                                            {user.is_active ? 'Bloquear' : 'Activar'}
                                                        </Button>
                                                        <Button 
                                                            variant="destructive" 
                                                            size="sm" 
                                                            onClick={() => handleDelete(user)}
                                                            disabled={processing}
                                                            className="shadow-sm rounded-xl"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic font-medium px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">Rol Protegido</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {users.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-16 text-muted-foreground font-medium text-lg">
                                                No hay usuarios registrados.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
