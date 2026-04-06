import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Lock, Package, MessageCircle, ShoppingCart, LayoutList, ChevronRight, Store, Settings, Send } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<string | null>(null);

    const handleLockedClick = (title: string, e: React.MouseEvent) => {
        e.preventDefault();
        setSelectedModule(title);
        setIsUpgradeModalOpen(true);
    };

    return (
        <>
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel>Menú</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.locked ? (
                                <SidebarMenuButton onClick={(e) => handleLockedClick(item.title, e)} className="text-muted-foreground hover:text-foreground group flex justify-between w-full relative overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span>{item.title}</span>
                                    </div>
                                    <Lock className="h-3.5 w-3.5 opacity-50 transition-all group-hover:opacity-100 group-hover:text-amber-500" />
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton asChild isActive={item.url === page.url}>
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl bg-zinc-50 dark:bg-zinc-950">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
                            <Lock className="w-64 h-64 rotate-12" />
                        </div>
                        <div className="relative z-10 flex gap-4 items-start">
                            <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shrink-0 shadow-xl">
                                <Lock className="h-8 w-8 text-white drop-shadow-md" />
                            </div>
                            <div className="space-y-1.5 pt-1">
                                <DialogTitle className="text-3xl font-black tracking-tight drop-shadow-sm">Módulo Bloqueado</DialogTitle>
                                <DialogDescription className="text-primary-foreground/90 font-medium text-base">
                                    El módulo <span className="font-bold underline decoration-white/40 underline-offset-2">{selectedModule}</span> requiere una licencia activa.
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold mb-2">Desbloquea todo el potencial de tu negocio</h3>
                            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                                Te recomendamos adquirir nuestro <strong>Plan Sistema Integral</strong> para tener acceso ilimitado a todas estas herramientas en una sola compra.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex gap-3">
                                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                                    <LayoutList className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Catálogo Online</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Tu negocio en la web interactivo y contacto directo.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex gap-3">
                                <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                                    <ShoppingCart className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Live-Cuaderno</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Gestión de pedidos en tiempo real con tienda integrada.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex gap-3">
                                <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center shrink-0">
                                    <Store className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Venta-Inventario</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Punto de venta e inventarios para múltiples sucursales.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex gap-3">
                                <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                                    <MessageCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">WhatsApp Bot</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Automatización de mensajes y atención al cliente.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button className="flex-1 h-12 rounded-xl text-md shadow-lg shadow-primary/20" asChild>
                                <a href="https://miracode.tech/1bs/" target="_blank" rel="noopener noreferrer">
                                    Visitar pagina <ChevronRight className="h-5 w-5 ml-1 inline-block" />
                                </a>
                            </Button>
                            <Button variant="outline" className="flex-1 h-12 rounded-xl text-md" onClick={() => setIsUpgradeModalOpen(false)}>
                                Volver al Dashboard
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
