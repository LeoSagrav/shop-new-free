import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, Building2, User, Mail, Lock, Phone, Briefcase } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

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
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nombre_empresa: '',
        celular: '',
        tipo: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title="Crea tu cuenta profesional" 
            description="Ingresa tus datos para comenzar a gestionar tu catálogo online hoy mismo"
        >
            <Head title="Registro" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="h-4 w-4 opacity-70" /> Nombre Completo
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Ej: Juan Pérez"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4 opacity-70" /> Correo Electrónico
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="correo@ejemplo.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4 opacity-70" /> Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="flex items-center gap-2">
                                <Lock className="h-4 w-4 opacity-70" /> Confirmar
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    <div className="my-2 border-t pt-4">
                        <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Información de tu Negocio</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="nombre_empresa" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 opacity-70" /> Nombre de la Empresa o Negocio
                        </Label>
                        <Input
                            id="nombre_empresa"
                            type="text"
                            required
                            tabIndex={5}
                            value={data.nombre_empresa}
                            onChange={(e) => setData('nombre_empresa', e.target.value)}
                            disabled={processing}
                            placeholder="Ej: Mi Tienda Online"
                        />
                        <InputError message={errors.nombre_empresa} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="celular" className="flex items-center gap-2">
                                <Phone className="h-4 w-4 opacity-70" /> Celular / WhatsApp
                            </Label>
                            <Input
                                id="celular"
                                type="text"
                                required
                                tabIndex={6}
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                disabled={processing}
                                placeholder="77712345"
                            />
                            <InputError message={errors.celular} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tipo" className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 opacity-70" /> Tipo de Negocio
                            </Label>
                            <Select 
                                value={data.tipo} 
                                onValueChange={(value) => setData('tipo', value)}
                                disabled={processing}
                            >
                                <SelectTrigger tabIndex={7}>
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
                            <InputError message={errors.tipo} />
                        </div>
                    </div>

                    <Button type="submit" className="mt-4 w-full h-11 text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]" tabIndex={8} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Crear mi cuenta gratuita
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <Link 
                        href={route('login')} 
                        className="font-semibold text-primary underline-offset-4 hover:underline" 
                        tabIndex={9}
                    >
                        Inicia sesión aquí
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
