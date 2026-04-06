import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Package, Search, Store, Image as ImageIcon } from 'lucide-react';
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
    stock: number | null;
    imagen: string | null;
    empresa?: Empresa;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    productos: {
        data: Producto[];
        links: PaginationLink[];
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
    };
}

export default function AdminProductos({ productos, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('admin.productos.index'), { search }, { preserveState: true, preserveScroll: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Catálogo Global', href: '/admin/productos' }]}>
            <Head title="Catálogo Global - Administrador" />
            
            <div className="flex-1 w-full p-4 md:p-8 space-y-8 bg-zinc-50/50 dark:bg-zinc-950/50">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                            <Package className="h-8 w-8 text-steel-blue-600" /> Catálogo Global de Productos
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Visualiza y filtra todos los productos publicados en todas las tiendas.</p>
                    </div>
                </header>

                <Card className="border-steel-blue-100 dark:border-zinc-800 shadow-xl shadow-steel-blue-900/5 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-white dark:bg-zinc-900 pb-4 border-b border-zinc-100 dark:border-zinc-800 px-6 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <span>Inventario Consolidado</span>
                            <Badge variant="secondary" className="bg-steel-blue-100 text-steel-blue-800">
                                {productos.total} Totales
                            </Badge>
                        </CardTitle>
                        
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input 
                                placeholder="Buscar por producto o tienda..." 
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
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 pl-6 w-16">Imagen</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Producto</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Precio</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Stock / Disp.</TableHead>
                                        <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 text-right pr-6">Tienda (Empresa)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productos.data.map((producto) => (
                                        <TableRow key={producto.id} className="group border-zinc-100 dark:border-zinc-800">
                                            <TableCell className="pl-6">
                                                {producto.imagen ? (
                                                    <img 
                                                        src={producto.imagen.startsWith('/') || producto.imagen.startsWith('http') ? producto.imagen : `/storage/${producto.imagen}`} 
                                                        alt={producto.nombre} 
                                                        className="w-10 h-10 object-cover rounded-lg border border-zinc-100" 
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                                                        <ImageIcon className="w-4 h-4 text-zinc-400" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-bold text-zinc-800 dark:text-zinc-200">
                                                {producto.nombre}
                                            </TableCell>
                                            <TableCell className="text-zinc-600 font-medium whitespace-nowrap">
                                                Bs {producto.precio}
                                            </TableCell>
                                            <TableCell>
                                                {producto.stock !== null ? (
                                                    <Badge variant="outline" className={producto.stock > 0 ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'}>
                                                        {producto.stock} en stock
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-zinc-400 italic">Ilimitado</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {producto.empresa ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="font-bold text-steel-blue-700 dark:text-steel-blue-300">{producto.empresa.nombre_empresa}</span>
                                                        <div className="h-8 w-8 rounded-lg outline outline-1 outline-steel-blue-200 bg-steel-blue-50 dark:bg-zinc-800 flex items-center justify-center">
                                                            <Store className="h-4 w-4 text-steel-blue-600 dark:text-steel-blue-400" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-400 italic text-sm font-medium">Global</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {productos.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-16 text-muted-foreground font-medium text-lg">
                                                No se encontraron productos con esos filtros.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {productos.links && productos.links.length > 3 && (
                            <div className="py-4 px-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <div className="text-sm text-zinc-500 font-medium hidden md:block">
                                    Mostrando {productos.from || 0} a {productos.to || 0} de {productos.total}
                                </div>
                                <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                                    {productos.links.map((link, i) => (
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
