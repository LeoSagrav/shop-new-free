import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: any;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title="Bienvenido de nuevo" 
            description="Ingresa tus credenciales para acceder a tu panel de administración"
        >
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400 text-center">
                    {status}
                </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">

                    {/* EMAIL */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4 opacity-70" /> Correo Electrónico
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="correo@ejemplo.com"
                            className="h-11"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* PASSWORD */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4 opacity-70" /> Contraseña
                            </Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="h-11"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* REMEMBER */}
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="remember" 
                            name="remember" 
                            tabIndex={3} 
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                        />
                        <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                            Mantener sesión iniciada
                        </Label>
                    </div>

                    {/* BUTTON CON GRADIENTE 🔥 */}
                    <Button
                        type="submit"
                        tabIndex={4}
                        disabled={processing}
                        className="mt-2 w-full h-11 text-base text-white font-semibold 
                                   bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 
                                   hover:from-blue-700 hover:to-cyan-500
                                   shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                        )}
                        Ingresar al sistema
                    </Button>
                </div>

                {/* REGISTER */}
                <div className="text-muted-foreground text-center text-sm">
                    ¿No tienes una cuenta aún?{' '}
                    <Link 
                        href={route('register')} 
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                        tabIndex={5}
                    >
                        Regístrate gratis
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}