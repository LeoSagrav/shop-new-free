import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Package, Trash2, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { type BreadcrumbItem } from '@/types';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number | null;
    imagen: string | null;
}

interface Props {
    productos: Producto[];
}

export default function Productos({ productos }: Props) {
    const { tenant } = usePage().props as { tenant?: { slug?: string } };
    const slug = tenant?.slug || '';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Productos',
            href: `/${slug}/productos`,
        },
    ];
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        nombre: '',
        precio: '',
        stock: '',
        imagen: null as File | null,
    });

    useEffect(() => {
        return () => {
            if (previewImage?.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleFileChange = (file: File | null) => {
        if (previewImage?.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage);
        }

        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setData('imagen', file);
        } else {
            setPreviewImage(null);
            setData('imagen', null);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        const file = event.dataTransfer.files?.[0];

        if (file && file.type.startsWith('image/')) {
            handleFileChange(file);
        }
    };

    const handleOpenChange = (value: boolean) => {
        setOpen(value);

        if (!value) {
            setPreviewImage(null);
            reset();
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('productos.store', { empresa: slug }), {
            onSuccess: () => {
                setOpen(false);
                reset();
                setPreviewImage(null);
            },
        });
    };

    const emptyCards = Array.from({ length: Math.max(0, 6 - productos.length) });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Productos" />
            
            <div className="flex items-center justify-between p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mis Productos</h1>
                    <p className="text-muted-foreground">Administra el catálogo de tu empresa.</p>
                </div>

                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Agregar producto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submit}>
                            <DialogHeader>
                                <DialogTitle>Nuevo Producto</DialogTitle>
                                <DialogDescription>
                                    Ingresa los detalles del nuevo producto para tu catálogo.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Nombre del producto"
                                        required
                                    />
                                    {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="precio">Precio</Label>
                                    <Input
                                        id="precio"
                                        type="number"
                                        step="0.01"
                                        value={data.precio}
                                        onChange={(e) => setData('precio', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.precio && <p className="text-sm text-destructive">{errors.precio}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Stock (Opcional)</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        placeholder="Cantidad disponible"
                                    />
                                    {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="imagen">Imagen del Producto</Label>
                                    <label
                                        htmlFor="imagen"
                                        onDragOver={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            setDragActive(true);
                                        }}
                                        onDragLeave={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            setDragActive(false);
                                        }}
                                        onDrop={handleDrop}
                                        className={`group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-background/80 px-4 py-6 text-center transition ${dragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'}`}
                                    >
                                        <input
                                            id="imagen"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                                        />

                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Previsualización"
                                                className="max-h-48 w-full rounded-md object-cover"
                                            />
                                        ) : (
                                            <>
                                                <Package className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-sm font-medium">Haz click o arrastra aquí tu imagen</p>
                                                <p className="text-xs text-muted-foreground">Formatos JPG, PNG, GIF</p>
                                            </>
                                        )}
                                    </label>
                                    {errors.imagen && <p className="text-sm text-destructive">{errors.imagen}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Crear Producto'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="px-4 md:px-8 pb-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {productos.map((producto) => (
                        <Card key={producto.id} className="overflow-hidden transition-all hover:shadow-md">
                            <div className="aspect-video bg-muted flex items-center justify-center">
                                {producto.imagen ? (
                                    <img src={producto.imagen} alt={producto.nombre} className="object-cover w-full h-full" />
                                ) : (
                                    <Package className="h-12 w-12 text-muted-foreground/50" />
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{producto.nombre}</CardTitle>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Bs. {producto.precio}</span>
                                    {producto.stock !== null && (
                                        <span className="text-xs text-muted-foreground">Stock: {producto.stock}</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardFooter className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 gap-2">
                                    <Edit className="h-3 w-3" /> Editar
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {emptyCards.map((_, i) => (
                        <Card key={`empty-${i}`} className="border-dashed flex flex-col items-center justify-center p-6 bg-muted/20 opacity-60">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                            <div className="mt-6 w-full flex gap-2">
                                <Skeleton className="h-8 flex-1" />
                                <Skeleton className="h-8 w-10" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
