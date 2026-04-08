import { Head, Link, useForm } from '@inertiajs/react';
import { Briefcase, Building2, Check, CheckCircle2, ChevronLeft, ChevronRight, Eye, LoaderCircle, Lock, Mail, Phone, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

    const normalizeBoliviaPhone = (value: string) => {
        const digits = value.replace(/\D/g, '');
        return digits.startsWith('591') ? digits.slice(3) : digits;
    };

    const formatBoliviaPhoneInput = (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (!digits) {
            return '';
        }

        if (!/^[67]/.test(digits)) {
            const validStart = digits.match(/[67]/);
            if (!validStart) {
                return '';
            }
            return digits.slice(digits.indexOf(validStart[0]));
        }

        return digits.slice(0, 8);
    };

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
            const celular = normalizeBoliviaPhone(data.celular || '');
            if (!celular) {
                nextErrors.celular = 'Ingresa un número de WhatsApp';
            } else if (!/^[67]\d{7}$/.test(celular)) {
                nextErrors.celular = 'Ingresa un numero de celular válido';
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
                    if (errors.email || errors.name || errors.password) setStep(2);
                    else if (errors.nombre_empresa || errors.tipo || errors.celular) setStep(1);
                },
            });
        }, 1000);
    };

    const steps = [
        { id: 1, label: 'Negocio', icon: Building2 },
        { id: 2, label: 'Cuenta', icon: User },
        { id: 3, label: 'Revisión', icon: Eye },
    ];

    const isLoading = processing || isSimulatingLoad;

    return (
        <AuthLayout
            title={step === 3 ? 'Verifica tus datos' : 'Crea tu cuenta'}
            description={
                step === 1
                    ? 'Comencemos con la información de tu empresa o negocio'
                    : step === 2
                      ? 'Ahora configura los datos de acceso para tu cuenta'
                      : 'Revisa que todo esté correcto para finalizar el registro'
            }
        >
            <Head title="Registro Multipaso" />

            {/* Custom Loader Styles */}
            <style>{`
                .custom-loader {
                    --d:22px;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    color: #5286F4;
                    box-shadow: 
                        calc(1*var(--d))      calc(0*var(--d))     0 0,
                        calc(0.707*var(--d))  calc(0.707*var(--d)) 0 1px,
                        calc(0*var(--d))      calc(1*var(--d))     0 2px,
                        calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 3px,
                        calc(-1*var(--d))     calc(0*var(--d))     0 4px,
                        calc(-0.707*var(--d)) calc(-0.707*var(--d))0 5px,
                        calc(0*var(--d))      calc(-1*var(--d))    0 6px;
                    animation: s7 1s infinite steps(8);
                }

                @keyframes s7 {
                    100% {transform: rotate(1turn)}
                }
            `}</style>

            {/* Full Page Loader Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
                    <div className="custom-loader mb-6"></div>
                    <p className="text-zinc-700 dark:text-zinc-300 text-center text-lg font-medium">
                        Espera un momento, se está creando tu página...
                    </p>
                </div>
            )}

            {/* Stepper Visual */}
            <div className="relative mb-10">
                <div className="relative z-10 flex items-center justify-between px-2">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                                    step >= s.id
                                        ? 'bg-primary border-primary text-primary-foreground shadow-primary/20 shadow-lg'
                                        : 'bg-background border-muted text-muted-foreground',
                                )}
                            >
                                {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                            </div>
                            <span
                                className={cn(
                                    'text-[10px] font-black tracking-widest uppercase transition-colors duration-300',
                                    step >= s.id ? 'text-primary' : 'text-muted-foreground',
                                )}
                            >
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
                {/* Connecting Line */}
                <div className="bg-muted absolute top-5 left-0 -z-0 h-[2px] w-full">
                    <div
                        className="bg-primary h-full transition-all duration-500 ease-in-out"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                {/* Paso 1: Información de la Empresa */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 grid gap-6 duration-500">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre_empresa" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <Building2 className="h-4 w-4 opacity-70" /> Nombre de la Empresa o Negocio
                            </Label>
                            <Input
                                id="nombre_empresa"
                                required
                                value={data.nombre_empresa}
                                onChange={(e) => setData('nombre_empresa', e.target.value)}
                                disabled={isLoading}
                                placeholder="Ej: Mi Tienda Online"
                                className="h-11 shadow-sm"
                            />
                            <InputError message={errors.nombre_empresa || stepErrors.nombre_empresa} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tipo" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <Briefcase className="h-4 w-4 opacity-70" /> Tipo de Negocio
                            </Label>
                            <Select value={data.tipo} onValueChange={(value) => setData('tipo', value)} disabled={isLoading}>
                                <SelectTrigger className="h-11 shadow-sm">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tipo || stepErrors.tipo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="celular" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <Phone className="h-4 w-4 opacity-70" /> Celular de WhatsApp
                            </Label>
                            <div className="border-input bg-background flex rounded-lg border shadow-sm">
                                <span className="inline-flex items-center rounded-l-lg bg-slate-100 px-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                                    🇧🇴 +591
                                </span>
                                <Input
                                    id="celular"
                                    required
                                    value={data.celular}
                                    onChange={(e) => setData('celular', formatBoliviaPhoneInput(e.target.value))}
                                    disabled={isLoading}
                                    placeholder="77123456"
                                    inputMode="numeric"
                                    maxLength={8}
                                    className="h-11 flex-1 rounded-l-none border-none shadow-none"
                                />
                            </div>
                            <InputError message={errors.celular || stepErrors.celular} />
                        </div>

                        <Button
                            type="button"
                            onClick={nextStep}
                            disabled={isLoading}
                            className="mt-4 h-12 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-500 active:scale-[0.98]"
                        >
                            Siguiente <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                )}

                {/* Paso 2: Información de la Cuenta */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 grid gap-6 duration-500">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
                                <User className="h-4 w-4 opacity-70" /> Tu Nombre Completo
                            </Label>
                            <Input
                                id="name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={isLoading}
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
                                disabled={isLoading}
                                placeholder="correo@ejemplo.com"
                                className="h-11 shadow-sm"
                            />
                            <InputError message={errors.email || stepErrors.email} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    title="Mínimo 8 caracteres"
                                    className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300"
                                >
                                    <Lock className="h-4 w-4 opacity-70" /> Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                    placeholder="••••••••"
                                    className="h-11 shadow-sm"
                                />
                                <InputError message={errors.password_confirmation || stepErrors.password_confirmation} />
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <Button type="button" onClick={prevStep} variant="outline" className="h-12 text-lg" disabled={isLoading}>
                                <ChevronLeft className="mr-2 h-5 w-5" /> Atrás
                            </Button>
                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={isLoading}
                                className="h-12 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-500 active:scale-[0.98]"
                            >
                                Siguiente <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Paso 3: Revisión Final */}
                {step === 3 && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <div className="mb-8 space-y-8">
                            {/* DATOS NEGOCIO */}
                            <div className="space-y-4">
                                <h3 className="text-primary flex items-center gap-2 text-sm font-black tracking-widest uppercase">
                                    <Building2 className="h-4 w-4" /> Datos del Negocio
                                </h3>

                                {/* Empresa (GRANDE y en una fila) */}
                                <div>
                                    <p className="text-muted-foreground text-xs">Empresa o Negocio</p>
                                    <p className="text-xl font-bold tracking-tight">{data.nombre_empresa}</p>
                                </div>

                                {/* Rubro + Contacto en la misma fila */}
                                <div className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Tipo de Negocio</p>
                                        <p className="font-semibold">{data.tipo}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-muted-foreground text-xs">Contacto</p>
                                        <p className="font-semibold">{data.celular}</p>
                                    </div>
                                </div>
                            </div>

                            {/* DATOS USUARIO */}
                            <div className="space-y-4">
                                <h3 className="text-primary flex items-center gap-2 text-sm font-black tracking-widest uppercase">
                                    <User className="h-4 w-4" /> Datos de Usuario
                                </h3>

                                {/* Nombre en fila completa */}
                                <div>
                                    <p className="text-muted-foreground text-xs">Nombres y Apellidos</p>
                                    <p className="font-semibold">{data.name}</p>
                                </div>

                                {/* Email en fila completa */}
                                <div>
                                    <p className="text-muted-foreground text-xs">Correo electronico</p>
                                    <p className="font-semibold">{data.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button type="button" onClick={prevStep} variant="outline" className="h-12 text-lg" disabled={isLoading}>
                                <ChevronLeft className="mr-2 h-5 w-5" /> Volver
                            </Button>

                            <Button
                                type="submit"
                                className="h-12 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-lg font-semibold text-white shadow-xl transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-500 active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Procesando...
                                    </>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
                <div className="text-muted-foreground mt-4 text-center text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href={route('login')} className="text-primary font-bold underline-offset-4 hover:underline">
                        Inicia sesión aquí
                    </Link>
                </div>
            </form>

            {/* Success Congratulation Modal */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="rounded-[2.5rem] border-none py-16 text-center shadow-2xl sm:max-w-md">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-green-100 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20">
                        <CheckCircle2 className="animate-in zoom-in spin-in-90 h-12 w-12 text-green-600 duration-500 dark:text-green-400" />
                    </div>
                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">¡Felicidades!</DialogTitle>
                        <DialogDescription className="text-muted-foreground px-4 text-lg">
                            Tu cuenta ha sido creada exitosamente. Estamos preparándolo todo para que comiences a gestionar tu negocio.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-10 px-8">
                        <div className="text-primary flex items-center justify-center gap-3 font-bold">
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                            <span>Redirigiendo a tu panel...</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthLayout>
    );
}