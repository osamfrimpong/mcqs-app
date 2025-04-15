import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { motion } from 'framer-motion';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
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
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <motion.form 
                className="flex flex-col gap-6" 
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="bg-white/20 text-white placeholder:text-white/70 border-white/30 focus:border-white focus-visible:ring-white/30"
                        />
                        <InputError message={errors.email} className="text-pink-200" />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-white">Password</Label>
                            {/* {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-pink-200 hover:text-white" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )} */}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="bg-white/20 text-white placeholder:text-white/70 border-white/30 focus:border-white focus-visible:ring-white/30"
                        />
                        <InputError message={errors.password} className="text-pink-200" />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="border-white/50 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                        />
                        <Label htmlFor="remember" className="text-white">Remember me</Label>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button 
                            type="submit" 
                            className="mt-4 w-full bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700" 
                            tabIndex={4} 
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Log in
                        </Button>
                    </motion.div>
                </div>

                <div className="text-center text-sm text-white/80">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5} className="text-pink-200 hover:text-white">
                        Sign up
                    </TextLink>
                </div>
            </motion.form>

            {status && <div className="mb-4 text-center text-sm font-medium text-pink-200">{status}</div>}
        </AuthLayout>
    );
}