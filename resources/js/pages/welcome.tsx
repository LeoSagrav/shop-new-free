import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Package, ShoppingCart, Trash2, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
        celular?: string;
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
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Header scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Persist cart
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Toast notification auto-hide
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const addToCart = (producto: Producto) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === producto.id);
            if (existing) {
                return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
        setToastMessage(`${producto.nombre} agregado al carrito`);
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.cantidad + delta);
                return { ...item, cantidad: newQty };
            }
            return item;
        }));
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
    }, [cart]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('pedidos.store', { empresa: empresa.slug }), {
            onSuccess: () => {
                // Capturar productos antes de vaciar el carrito
                const productosTexto = cart.map(item => `${item.nombre} x${item.cantidad}`).join(', ');
                const mensaje = `Hola soy ${data.cliente} de ${data.departamento} realice mi pedido de ${productosTexto} espero su confirmacion gracias.`;
                
                setCart([]);
                setIsCheckoutOpen(false);
                setIsSuccessOpen(true);
                reset();
                
                // Enviar mensaje a WhatsApp si hay número disponible
                if (empresa.celular) {
                    window.open(`https://wa.me/${empresa.celular}?text=${encodeURIComponent(mensaje)}`, '_blank');
                }
            },
            onError: () => {
                setIsErrorOpen(true);
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 font-sans selection:bg-primary/20">
            <Head title={`Catálogo - ${empresa?.nombre_empresa}`} />
            
            {/* Navigation */}
            <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled 
                ? 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b shadow-sm py-3' 
                : 'bg-transparent py-5'
            }`}>
                <div className="container px-3 md:px-6 flex items-center justify-between mx-auto">
                    <Link href="#" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
                        <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                            <Package className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <span className="font-bold text-base md:text-xl tracking-tight truncate">{empresa?.nombre_empresa || 'ShopFree'}</span>
                    </Link>

                    <div className="flex items-center gap-2 md:gap-3">
                        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                            <SheetTrigger asChild>
                                <Button variant="secondary" className="relative h-9 md:h-11 px-3 md:px-4 gap-2 rounded-full border shadow-sm hover:shadow-md transition-all">
                                    <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                                    <span className="hidden md:inline font-medium">Mi Carrito</span>
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[8px] md:text-[10px] font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white dark:border-zinc-900 animate-in zoom-in">
                                            {cart.reduce((a, b) => a + b.cantidad, 0)}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                                <SheetHeader className="p-6 border-b">
                                    <SheetTitle className="text-2xl flex items-center gap-2">
                                        <ShoppingCart className="h-6 w-6 text-primary" /> Tu Carrito
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {cart.length > 0 ? (
                                        cart.map(item => (
                                            <div key={item.id} className="flex gap-4 group">
                                                <div className="h-20 w-20 bg-muted rounded-xl flex-shrink-0 overflow-hidden border">
                                                    {item.imagen 
                                                        ? <img src={item.imagen} className="object-cover h-full w-full" /> 
                                                        : <div className="h-full w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800"><Package className="h-8 w-8 text-muted-foreground/30" /></div>
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                                    <div>
                                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.nombre}</h4>
                                                        <p className="text-sm font-bold text-primary mt-0.5">Bs. {item.precio}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center border rounded-lg bg-zinc-50 dark:bg-zinc-800 px-1 py-0.5 scale-90 -ml-1">
                                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary transition-colors"><Trash2 className="h-3 w-3" /></button>
                                                            <span className="w-6 text-center text-xs font-bold">{item.cantidad}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary transition-colors text-lg line-none leading-none">+</button>
                                                        </div>
                                                        <button 
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                            <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                                <ShoppingCart className="h-10 w-10 text-zinc-400" />
                                            </div>
                                            <p className="font-medium">El carrito está vacío</p>
                                            <p className="text-sm">Agrega productos para comenzar</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 border-t bg-zinc-50 dark:bg-zinc-900/50">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-zinc-500 font-medium">Subtotal</span>
                                        <span className="text-2xl font-bold tracking-tight">Bs. {cartTotal.toFixed(2)}</span>
                                    </div>
                                    <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20" disabled={cart.length === 0}>
                                                Continuar al Pago <ChevronRight className="h-5 w-5 ml-2" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col">
                                            <form onSubmit={handleCheckout} className="flex flex-col h-full">
                                                <div className="bg-primary p-6 text-primary-foreground">
                                                    <DialogTitle className="text-2xl">Finalizar Pedido</DialogTitle>
                                                    <DialogDescription className="text-primary-foreground/80 mt-1">Completa tus datos y revisa tu compra</DialogDescription>
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                                    {/* Productos del carrito */}
                                                    <div className="space-y-3">
                                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Productos ({cart.length})</h3>
                                                        <div className="space-y-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3 border">
                                                            {cart.map(item => (
                                                                <div key={item.id} className="flex justify-between items-center text-sm py-2 px-1 border-b last:border-b-0">
                                                                    <div>
                                                                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.nombre}</p>
                                                                        <p className="text-xs text-muted-foreground">x{item.cantidad}</p>
                                                                    </div>
                                                                    <p className="font-semibold text-primary">Bs. {(item.precio * item.cantidad).toFixed(2)}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Resumen total */}
                                                    <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4 border border-primary/20">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Total</span>
                                                            <span className="text-2xl font-black text-primary">Bs. {cartTotal.toFixed(2)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Formulario de datos */}
                                                    <div className="space-y-4 pt-4 border-t">
                                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Tus Datos</h3>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="cliente" className="text-xs uppercase tracking-wider font-bold text-zinc-500">Nombre Completo</Label>
                                                            <Input id="cliente" value={data.cliente} onChange={e => setData('cliente', e.target.value)} required placeholder="Juan Pérez" className="h-11 rounded-lg" />
                                                            {errors.cliente && <p className="text-xs text-destructive">{errors.cliente}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="celular" className="text-xs uppercase tracking-wider font-bold text-zinc-500">Celular de Contacto</Label>
                                                            <Input id="celular" value={data.celular} onChange={e => setData('celular', e.target.value)} required placeholder="77712345" className="h-11 rounded-lg" />
                                                            {errors.celular && <p className="text-xs text-destructive">{errors.celular}</p>}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="departamento" className="text-xs uppercase tracking-wider font-bold text-zinc-500">Ciudad</Label>
                                                                <Input id="departamento" value={data.departamento} onChange={e => setData('departamento', e.target.value)} required placeholder="La Paz" className="h-11 rounded-lg" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="pais" className="text-xs uppercase tracking-wider font-bold text-zinc-500">País</Label>
                                                                <Input id="pais" value={data.pais} onChange={e => setData('pais', e.target.value)} required className="h-11 rounded-lg" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <DialogFooter className="p-6 pt-0 border-t bg-zinc-50 dark:bg-zinc-900/30">
                                                    <Button type="submit" disabled={processing} className="w-full h-12 text-lg rounded-xl">
                                                        {processing ? 'Procesando...' : `Confirmar Pedido • Bs. ${cartTotal.toFixed(2)}`}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </SheetContent>
                        </Sheet>
                        
                        <div className="h-6 md:h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden md:block"></div>

                        {auth.user ? (
                            <Button asChild variant="ghost" className="rounded-full h-9 md:h-11 px-3 md:px-6 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs md:text-base">
                                <Link href={route('dashboard', { empresa: empresa.slug })}>Panel</Link>
                            </Button>
                        ) : (
                            <div className="hidden md:flex items-center gap-1">
                                <Button asChild variant="ghost" className="rounded-full h-11 px-5 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    <Link href={route('login')}>Ingresar</Link>
                                </Button>
                                <Button asChild className="rounded-full h-11 px-6 font-medium shadow-none">
                                    <Link href={route('register')}>Empezar</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-3 md:pt-4 pb-3 md:pb-4 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-70"></div>
                    
                    <div className="container px-3 md:px-6 mx-auto text-center">
                        <Badge variant="outline" className="mb-3 md:mb-6 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white dark:bg-zinc-900 border-primary/20 text-primary font-bold tracking-wide uppercase text-[8px] md:text-[10px]">
                            Catálogo Oficial
                        </Badge>
                        <h1 className="text-2xl sm:text-3xl md:text-6xl font-extrabold tracking-tight mb-3 md:mb-6 leading-[1.1]">
                            Catálogo de <br className="hidden md:block" />
                            {empresa?.nombre_empresa}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-xl text-muted-foreground max-w-[600px] mx-auto leading-relaxed mb-6 md:mb-10">
                            Explora nuestra selección exclusiva de productos de alta calidad.
                        </p>
                    </div>
                </section>

                <div className="container px-3 md:px-6 mx-auto">
                    <Separator className="mb-8 md:mb-16 opacity-50" />
                </div>

                {/* Products Section */}
                <section className="container px-3 md:px-6 pb-16 md:pb-32 mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-3 md:gap-6">
                        <div className="space-y-0.5 md:space-y-1">
                            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Nuestros Productos</h2>
                            <p className="text-xs md:text-base text-muted-foreground">Más de {productos.length} artículos disponibles</p>
                        </div>
                        <div className="flex items-center gap-1 md:gap-3 bg-white dark:bg-zinc-900 p-0.5 md:p-1 rounded-lg md:rounded-xl border shadow-sm self-start hidden md:flex">
                            <Button variant="secondary" size="sm" className="rounded-lg h-9 font-semibold">Todos</Button>
                            <Button variant="ghost" size="sm" className="rounded-lg h-9 text-muted-foreground font-medium">Populares</Button>
                            <Button variant="ghost" size="sm" className="rounded-lg h-9 text-muted-foreground font-medium">Nuevos</Button>
                        </div>
                    </div>

                    {productos.length > 0 ? (
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {productos.map((producto) => (
                                <Card key={producto.id} className="group overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col rounded-xl md:rounded-2xl">
                                    <div className="aspect-[4/5] bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center relative overflow-hidden">
                                        {producto.imagen ? (
                                            <img 
                                                src={producto.imagen} 
                                                alt={producto.nombre} 
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out" 
                                            />
                                        ) : (
                                            <Package className="h-20 w-20 text-zinc-200 dark:text-zinc-700" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-2 left-2 md:top-3 md:left-3">
                                            <Badge className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-zinc-900 dark:text-white border-none shadow-sm hover:bg-white text-xs md:text-sm">
                                                {empresa.nombre_empresa}
                                            </Badge>
                                        </div>
                                        <div className="absolute inset-x-3 bottom-3 md:bottom-3 md:left-3 md:right-3 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                                            <Button onClick={() => addToCart(producto)} className="w-full h-9 md:h-11 rounded-lg md:rounded-xl shadow-lg shadow-black/20 gap-1 md:gap-2 font-bold bg-white text-zinc-900 hover:bg-zinc-100 border-none transition-all active:scale-95 text-sm md:text-base">
                                                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" /> <span className="hidden md:inline">Agregar al Carrito</span><span className="md:hidden">Agregar</span>
                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader className="pt-3 md:pt-6 pb-1 md:pb-2 px-3 md:px-5 flex-1 items-start space-y-0.5 md:space-y-1.5">
                                        <div className="text-[8px] md:text-[10px] uppercase tracking-widest font-black text-primary/50">Categoría</div>
                                        <CardTitle className="line-clamp-2 text-sm md:text-xl font-bold leading-tight group-hover:text-primary transition-colors">{producto.nombre}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-3 md:px-5 py-1 md:py-2">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg md:text-2xl font-black tracking-tighter">Bs. {producto.precio}</span>
                                            <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">BOB</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-3 md:px-5 pb-3 md:pb-6 pt-2 md:pt-2 hidden md:flex">
                                        <Button variant="outline" className="w-full rounded-lg md:rounded-xl h-9 md:h-11 border-zinc-200 dark:border-zinc-800 font-bold" onClick={() => addToCart(producto)}>
                                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> <span className="text-xs md:text-base">Comprar</span>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] bg-zinc-50/50 dark:bg-zinc-900/20">
                            <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                                <Package className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Catálogo en mantenimiento</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">Pronto tendremos nuevos productos disponibles para ti. ¡Vuelve pronto!</p>
                        </div>
                    )}
                </section>
            </main>

            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-md text-center py-16 rounded-[2rem] border-none shadow-2xl">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 mb-8 border border-green-100 dark:border-green-900/50">
                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 animate-in zoom-in spin-in-90 duration-500" />
                    </div>
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-3xl font-black tracking-tight">¡Pedido Realizado!</DialogTitle>
                        <DialogDescription className="text-lg text-muted-foreground leading-relaxed px-4">
                            Tu pedido ha sido registrado con éxito. <br />
                            <strong>{empresa.nombre_empresa}</strong> se pondrá en contacto contigo a la brevedad.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-10 px-6">
                        <Button className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20" onClick={() => setIsSuccessOpen(false)}>
                            Seguir Explorando
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isErrorOpen} onOpenChange={setIsErrorOpen}>
                <DialogContent className="sm:max-w-md text-center py-16 rounded-[2rem] border-none shadow-2xl">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-8 border border-red-100 dark:border-red-900/50">
                        <Package className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-3xl font-black tracking-tight">Pedidos no disponibles</DialogTitle>
                        <DialogDescription className="text-lg text-muted-foreground leading-relaxed px-4">
                            Lo sentimos, los pedidos no están disponibles en este momento. <br />
                            Contacta a <strong>{empresa.nombre_empresa}</strong> para más información.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-10 px-6">
                        <Button className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20" onClick={() => setIsErrorOpen(false)}>
                            Entendido
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Toast Notificación */}
            {toastMessage && (
                <div className="fixed bottom-4 left-3 right-3 md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg shadow-black/20 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="text-sm md:text-base truncate">{toastMessage}</span>
                    </div>
                </div>
            )}

            <footer className="border-t py-12 md:py-20 bg-zinc-50 dark:bg-zinc-900/30">
                <div className="container px-3 md:px-6 mx-auto">
                    <div className="grid gap-6 md:gap-12 grid-cols-2 md:grid-cols-4 items-start mb-10 md:mb-20 text-center md:text-left">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-lg md:text-xl">
                                <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                    <Package className="h-3.5 w-3.5 md:h-5 md:w-5" />
                                </div>
                                <span className="truncate">{empresa?.nombre_empresa}</span>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                Tu destino premium para productos de alta calidad.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold uppercase tracking-widest text-[10px] md:text-xs py-1 transition-all border-b border-primary/20 inline-block">Navegación</h4>
                            <ul className="space-y-2 text-xs md:text-sm text-muted-foreground font-medium">
                                <li><a href="#" className="hover:text-primary transition-colors">Inicio</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Productos</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold uppercase tracking-widest text-[10px] md:text-xs py-1 transition-all border-b border-primary/20 inline-block">Soporte</h4>
                            <ul className="space-y-2 text-xs md:text-sm text-muted-foreground font-medium">
                                <li><a href="#" className="hover:text-primary transition-colors">Envíos</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold uppercase tracking-widest text-[10px] md:text-xs py-1 transition-all border-b border-primary/20 inline-block">Ubicación</h4>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-muted-foreground font-medium">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                                <span>Bolivia</span>
                            </div>
                        </div>
                    </div>
                    <Separator className="mb-6 md:mb-10 opacity-30" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground font-medium">
                        <p>© 2026 ShopFree para {empresa.nombre_empresa}. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-4 md:gap-6">
                            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-primary transition-colors">Términos</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
