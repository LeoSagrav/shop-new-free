import { Head, useForm, Link } from '@inertiajs/react';
import { 
    LoaderCircle, 
    Building2, 
    User, 
    Mail, 
    Lock, 
    Phone, 
    Briefcase, 
    ChevronRight, 
    ChevronLeft, 
    CheckCircle2, 
    Check, 
    Eye 
} from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    nombre_empresa: string;
    celular: string;
    tipo: string;
    [key: string]: any;
}

const businessTypes = [
    'Restaurante / Comida',
    'Tienda de Ropa / Accesorios',
    'Servicios Técnicos / Reparaciones',
    'Educación / Cursos',
    'Salud / Belleza',
    'Tecnología / Software',
    'Entretenimiento / Eventos',
    'Venta de Productos Varios',
    'Otro',
];

export default function Register() {
    const [step, setStep] = useState(1);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nombre_empresa: '',
        celular: '',
        tipo: '',
    });

    const validateStep = (currentStep: number) => {
        clearErrors();
        const nextErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!data.nombre_empresa?.trim()) {
                nextErrors.nombre_empresa = 'Por favor ingresa el nombre de tu empresa';
            }
            if (!data.tipo?.trim()) {
                nextErrors.tipo = 'Selecciona el tipo de negocio';
            }
            if (!data.celular?.trim()) {
                nextErrors.celular = 'Ingresa un número de WhatsApp';
            }
        } else if (currentStep === 2) {
            if (!data.name?.trim()) {
                nextErrors.name = 'Ingresa tu nombre completo';
            }
            if (!data.email?.trim()) {
                nextErrors.email = 'Ingresa tu correo electrónico';
            }
            if (!data.password?.trim()) {
                nextErrors.password = 'Ingresa una contraseña';
            }
            if (!data.password_confirmation?.trim()) {
                nextErrors.password_confirmation = 'Confirma tu contraseña';
            }
        }

        setStepErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsSimulatingLoad(true);
        
        // Simulating a slightly longer loader for better UX as requested
        setTimeout(() => {
            post(route('register'), {
                onFinish: () => {
                    reset('password', 'password_confirmation');
                },
                onSuccess: () => {
                    setIsSimulatingLoad(false);
                    setIsSuccessOpen(true);
                },
                onError: () => {
                    setIsSimulatingLoad(false);
                    // If there are errors (e.g. email taken), find where they are and go back to that step
                    if (errors.email || errors.name || errors.password) setStep(2);
                    else if (errors.nombre_empresa || errors.tipo || errors.celular) setStep(1);
                }
            });
        }, 1000);
    };

    const steps = [
        { id: 1, label: 'Negocio', icon: Building2 },
        { id: 2, label: 'Cuenta', icon: User },
        { id: 3, label: 'Revisión', icon: Eye },
    ];

    return (
        <AuthLayout 
            title={step === 3 ? "Verifica tus datos" : "Crea tu cuenta profesional"} 
            description={
                step === 1 ? "Comencemos con la información de tu empresa o negocio" :
                step === 2 ? "Ahora configura los datos de acceso para tu cuenta" :
                "Revisa que todo esté correcto para finalizar el registro"
            }
        >
            <Head title="Registro Multipaso" />
            
            {/* Stepper Visual */}
            <div className="mb-10 relative">
                <div className="flex justify-between items-center relative z-10 px-2">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-2">
                            <div className={cn(
                                "h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all duration-300",
                                step >= s.id ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background border-muted text-muted-foreground"
                            )}>
                                {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                            </div>
                            <span className={cn(
                                "text-[10px] uppercase font-black tracking-widest transition-colors duration-300",
                                step >= s.id ? "text-primary" : "text-muted-foreground"
                            )}>{s.label}</span>
                        </div>
                    ))}
                </div>
                {/* Connecting Line */}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-muted -z-0">
                    <div 
                        className="h-full bg-primary transition-all duration-500 ease-in-out" 
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                
                {/* Paso 1: Información da la Empresa */}
                {step === 1 && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre_empresa" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <Building2 className="h-4 w-4 opacity-70" /> Nombre de la Empresa o Negocio
                            </Label>
                            <Input
                                id="nombre_empresa"
                                required
                                value={data.nombre_empresa}
                                onChange={(e) => setData('nombre_empresa', e.target.value)}
                                disabled={processing}
                                placeholder="Ej: Mi Tienda Online"
                                className="h-11 shadow-sm"
                            />
                            <InputError message={errors.nombre_empresa || stepErrors.nombre_empresa} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tipo" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <Briefcase className="h-4 w-4 opacity-70" /> Tipo de Negocio
                            </Label>
                            <Select 
                                value={data.tipo} 
                                onValueChange={(value) => setData('tipo', value)}
                                disabled={processing}
                            >
                                <SelectTrigger className="h-11 shadow-sm">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tipo || stepErrors.tipo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="celular" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <Phone className="h-4 w-4 opacity-70" /> Celular de WhatsApp
                            </Label>
                            <Input
                                id="celular"
                                required
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                disabled={processing}
                                placeholder="77712345"
                                className="h-11 shadow-sm"
                            />
                            <InputError message={errors.celular || stepErrors.celular} />
                        </div>

                        <Button 
                            type="button" 
                            onClick={nextStep} 
                            className="mt-4 h-12 text-lg text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Siguiente <ChevronRight className="h-5 w-5 ml-2" />
                        </Button>
                    </div>
                )}

                {/* Paso 2: Información de la Cuenta */}
                {step === 2 && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <User className="h-4 w-4 opacity-70" /> Tu Nombre Completo
                            </Label>
                            <Input
                                id="name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Ej: Juan Pérez"
                                className="h-11 shadow-sm"
                            />
                            <InputError message={errors.name || stepErrors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <Mail className="h-4 w-4 opacity-70" /> Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="correo@ejemplo.com"
                                className="h-11 shadow-sm"
                            />
                            <InputError message={errors.email || stepErrors.email} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password" title="Mínimo 8 caracteres" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                    <Lock className="h-4 w-4 opacity-70" /> Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="h-11 shadow-sm"
                                />
                                <InputError message={errors.password || stepErrors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                    <Lock className="h-4 w-4 opacity-70" /> Confirmar
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="h-11 shadow-sm"
                                />
                                <InputError message={errors.password_confirmation || stepErrors.password_confirmation} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <Button type="button" onClick={prevStep} variant="outline" className="h-12 text-lg">
                                <ChevronLeft className="h-5 w-5 mr-2" /> Atrás
                            </Button>
                            <Button type="button" onClick={nextStep} className="h-12 text-lg text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Siguiente <ChevronRight className="h-5 w-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Paso 3: Revisión Final */}
                {step === 3 && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border p-6 space-y-6 mb-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Building2 className="h-4 w-4" /> Datos del Negocio
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Empresa</p>
                                        <p className="font-bold">{data.nombre_empresa}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Rubro</p>
                                        <p className="font-bold">{data.tipo}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Contacto</p>
                                        <p className="font-bold">{data.celular}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <User className="h-4 w-4" /> Datos de Usuario
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Nombre</p>
                                        <p className="font-bold">{data.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Email</p>
                                        <p className="font-bold">{data.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button type="button" onClick={prevStep} variant="outline" className="h-12 text-lg" disabled={isSimulatingLoad}>
                                <ChevronLeft className="h-5 w-5 mr-2" /> Volver
                            </Button>
                            <Button type="submit" className="h-12 text-lg text-white font-semibold shadow-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={processing || isSimulatingLoad}>
                                {(processing || isSimulatingLoad) ? (
                                    <><LoaderCircle className="h-5 w-5 animate-spin mr-2" /> Creando...</>
                                ) : (
                                    "Confirmar y Crear"
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="text-muted-foreground text-center text-sm mt-4">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href={route('login')} className="font-bold text-primary underline-offset-4 hover:underline">
                        Inicia sesión aquí
                    </Link>
                </div>
            </form>

            {/* Success Congratulation Modal */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-md text-center py-16 rounded-[2.5rem] border-none shadow-2xl">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 mb-8 border border-green-100 dark:border-green-900/50">
                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 animate-in zoom-in spin-in-90 duration-500" />
                    </div>
                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">¡Felicidades!</DialogTitle>
                        <DialogDescription className="text-lg text-muted-foreground px-4">
                            Tu cuenta ha sido creada exitosamente. Estamos preparándolo todo para que comiences a gestionar tu negocio.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-10 px-8">
                        <div className="flex items-center justify-center gap-3 text-primary font-bold">
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                            <span>Redirigiendo a tu panel...</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthLayout>
    );
}
