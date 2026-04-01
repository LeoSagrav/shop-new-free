import { Head, Link, usePage } from '@inertiajs/react';
import { Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number | null;
    imagen: string | null;
    empresa: {
        nombre_empresa: string;
    };
}

interface WelcomeProps {
    productos: Producto[];
}

export default function Welcome({ productos }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-background">
            <Head title="Catálogo Online" />
            
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <span>ShopFree</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Button asChild variant="outline">
                                <Link href={route('dashboard')}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href={route('login')}>Log in</Link>
                                </Button>
                                <Button asChild>
                                    <Link href={route('register')}>Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="container py-12">
                {/* Hero Section */}
                <section className="mb-16 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                        Tu Catálogo Online Favorito
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                        Descubre productos increíbles de empresas locales. Compra de forma fácil y segura.
                    </p>
                </section>

                {/* Products Grid */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Explorar Productos</h2>
                        <span className="text-muted-foreground">{productos.length} productos disponibles</span>
                    </div>

                    {productos.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {productos.map((producto) => (
                                <Card key={producto.id} className="overflow-hidden transition-all hover:shadow-lg flex flex-col">
                                    <div className="aspect-square bg-muted flex items-center justify-center relative">
                                        {producto.imagen ? (
                                            <img src={producto.imagen} alt={producto.nombre} className="object-cover w-full h-full" />
                                        ) : (
                                            <Package className="h-16 w-16 text-muted-foreground/30" />
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary backdrop-blur-sm border border-primary/20">
                                                {producto.empresa.nombre_empresa}
                                            </span>
                                        </div>
                                    </div>
                                    <CardHeader className="flex-1">
                                        <CardTitle className="line-clamp-2 text-lg">{producto.nombre}</CardTitle>
                                        <p className="text-sm text-muted-foreground">Por {producto.empresa.nombre_empresa}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Bs. {producto.precio}</div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full gap-2">
                                            <ShoppingCart className="h-4 w-4" /> Ver Detalles
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed rounded-xl">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">Aún no hay productos</h3>
                            <p className="text-muted-foreground">Vuelve más tarde para descubrir nuevas ofertas.</p>
                        </div>
                    )}
                </section>
            </main>

            <footer className="border-t py-12 bg-muted/30">
                <div className="container text-center text-sm text-muted-foreground">
                    <p>© 2026 ShopFree. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
