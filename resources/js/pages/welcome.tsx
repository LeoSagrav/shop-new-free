import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Package, ShoppingCart, Trash2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
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
    empresa: {
        nombre_empresa: string;
        slug: string;
    };
}

interface CartItem extends Producto {
    cantidad: number;
}

export default function Welcome({ productos, empresa }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Persist cart
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (producto: Producto) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === producto.id);
            if (existing) {
                return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    const { data, setData, post, processing, reset, errors } = useForm({
        cliente: '',
        celular: '',
        departamento: '',
        pais: 'Bolivia',
        items: [] as { id: number; cantidad: number }[],
    });

    useEffect(() => {
        const items = cart.map(item => ({ id: item.id, cantidad: item.cantidad }));
        setData('items', items);
    }, [cart]);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('pedidos.store', { empresa: empresa.slug }), {
            onSuccess: () => {
                setCart([]);
                setIsCheckoutOpen(false);
                setIsSuccessOpen(true);
                reset();
            },
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Catálogo Online" />
            
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <span>{empresa?.nombre_empresa || 'ShopFree'}</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="relative gap-2">
                                    <ShoppingCart className="h-4 w-4" />
                                    Carrito
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in">
                                            {cart.reduce((a, b) => a + b.cantidad, 0)}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Tu Carrito</SheetTitle>
                                </SheetHeader>
                                <div className="mt-8 space-y-4 flex-1 overflow-y-auto max-h-[70vh]">
                                    {cart.length > 0 ? (
                                        cart.map(item => (
                                            <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                                                <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                                                    {item.imagen ? <img src={item.imagen} className="object-cover h-full w-full rounded" /> : <Package className="h-6 w-6 text-muted-foreground" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium line-clamp-1">{item.nombre}</h4>
                                                    <p className="text-sm text-muted-foreground">{item.cantidad} x Bs. {item.precio}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">El carrito está vacío</div>
                                    )}
                                </div>
                                <SheetFooter className="mt-8 pt-4 border-t flex-col gap-4">
                                    <div className="flex justify-between items-center w-full mb-4">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-lg font-bold">Bs. {cartTotal.toFixed(2)}</span>
                                    </div>
                                    <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full" disabled={cart.length === 0}>Realizar Pedido</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <form onSubmit={handleCheckout}>
                                                <DialogHeader>
                                                    <DialogTitle>Finalizar Pedido</DialogTitle>
                                                    <DialogDescription>Completa tus datos para realizar la compra.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="cliente">Nombre Completo</Label>
                                                        <Input id="cliente" value={data.cliente} onChange={e => setData('cliente', e.target.value)} required />
                                                        {errors.cliente && <p className="text-sm text-destructive">{errors.cliente}</p>}
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="celular">Celular</Label>
                                                        <Input id="celular" value={data.celular} onChange={e => setData('celular', e.target.value)} required placeholder="Ej: 77712345" />
                                                        {errors.celular && <p className="text-sm text-destructive">{errors.celular}</p>}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="departamento">Ciudad/Depto</Label>
                                                            <Input id="departamento" value={data.departamento} onChange={e => setData('departamento', e.target.value)} required />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="pais">País</Label>
                                                            <Input id="pais" value={data.pais} onChange={e => setData('pais', e.target.value)} required />
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={processing} className="w-full">
                                                        Confirmar Pedido (Bs. {cartTotal.toFixed(2)})
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                        {auth.user ? (
                            <Button asChild variant="ghost">
                                <Link href={route('dashboard', { empresa: empresa.slug })}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost"><Link href={route('login')}>Log in</Link></Button>
                                <Button asChild><Link href={route('register')}>Register</Link></Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="container py-12">
                <section className="mb-16 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Catálogo de {empresa?.nombre_empresa}</h1>
                    <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">Descubre productos increíbles de empresas locales.</p>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Explorar Productos</h2>
                        <span className="text-muted-foreground">{productos.length} productos disponibles</span>
                    </div>

                    {productos.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {productos.map((producto) => (
                                <Card key={producto.id} className="overflow-hidden transition-all hover:shadow-lg flex flex-col group">
                                    <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
                                        {producto.imagen ? (
                                            <img src={producto.imagen} alt={producto.nombre} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <Package className="h-16 w-16 text-muted-foreground/30" />
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary backdrop-blur-sm border border-primary/20">
                                                {empresa.nombre_empresa}
                                            </span>
                                        </div>
                                    </div>
                                    <CardHeader className="flex-1">
                                        <CardTitle className="line-clamp-2 text-lg">{producto.nombre}</CardTitle>
                                        <p className="text-sm text-muted-foreground">Por {empresa.nombre_empresa}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Bs. {producto.precio}</div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full gap-2" onClick={() => addToCart(producto)}>
                                            <ShoppingCart className="h-4 w-4" /> Agregar al Carrito
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed rounded-xl">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">Aún no hay productos</h3>
                        </div>
                    )}
                </section>
            </main>

            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-md text-center py-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">¡Pedido Realizado!</DialogTitle>
                        <DialogDescription className="text-base pt-2">
                            Tu pedido ha sido registrado con éxito. La empresa se pondrá en contacto contigo pronto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-8">
                        <Button variant="outline" className="w-full" onClick={() => setIsSuccessOpen(false)}>Cerrar</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <footer className="border-t py-12 bg-muted/30 mt-auto">
                <div className="container text-center text-sm text-muted-foreground">
                    <p>© 2026 ShopFree. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
