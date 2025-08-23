'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, User, Mail, Shield, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { OrderFormData } from '@/types';
import { generateOrderId, validateEmail } from '@/lib/utils';

export function CheckoutForm() {
    const { cartItems, cartCount, totalPrice, clearCart } = useCartStore();
    
    const [formData, setFormData] = useState<OrderFormData>({
        name: '',
        phone: '',
        email: '',
        bankDetails: '',
        deliveryMethod: 'delivery',
        address: '',
        city: '',
        postalCode: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState('');
    
    // Email verification states
    const [emailVerificationStep, setEmailVerificationStep] = useState<'none' | 'sending' | 'sent' | 'verified'>('none');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Redirect if cart is empty
    if (cartItems.length === 0) {
        return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Coșul tău este gol
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Adaugă produse în coș pentru a continua comanda.
            </p>
            <Link href="/products">
                <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuă cumpărăturile
                </Button>
            </Link>
            </div>
        </div>
        );
    }

    const handleInputChange = (field: keyof OrderFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Validate email in real-time
        if (field === 'email') {
            const error = validateEmail(value);
            setEmailError(error);
            
            // Reset verification state if email changes
            if (emailVerificationStep !== 'none') {
                setEmailVerificationStep('none');
                setVerificationCode('');
                setVerificationError('');
            }
        }
    };

    const sendVerificationCode = async () => {
        if (emailError || !formData.email) {
            setVerificationError('Te rugăm să introduci o adresă de email validă.');
            return;
        }

        setEmailVerificationStep('sending');
        setVerificationError('');

        try {
            const response = await fetch('/api/send-verification-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const result = await response.json();

            if (result.success) {
                setEmailVerificationStep('sent');
            } else {
                setVerificationError(result.error || 'Eroare la trimiterea codului de verificare.');
                setEmailVerificationStep('none');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            setVerificationError('Eroare la trimiterea codului de verificare.');
            setEmailVerificationStep('none');
        }
    };

    const verifyEmailCode = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            setVerificationError('Te rugăm să introduci codul de 6 cifre.');
            return;
        }

        setIsVerifying(true);
        setVerificationError('');

        try {
            const response = await fetch('/api/verify-email-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: formData.email, 
                    code: verificationCode 
                }),
            });

            const result = await response.json();

            if (result.success) {
                setEmailVerificationStep('verified');
                setVerificationCode('');
            } else {
                setVerificationError(result.error || 'Cod de verificare invalid.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            setVerificationError('Eroare la verificarea codului.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Order details object
            const orderDetails = {
                orderId: generateOrderId(),
                timestamp: new Date().toISOString(),
                customer: {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    bankDetails: formData.bankDetails
                },
                delivery: {
                    method: formData.deliveryMethod,
                    address: {
                        street: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode
                    },
                    notes: formData.notes
                },
                items: cartItems.map(item => ({
                    productId: item.productId,
                    title: item.title,
                    volume: item.volume,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                })),
                summary: {
                    totalItems: cartCount,
                    totalPrice: totalPrice,
                    currency: 'MDL'
                }
            };

            console.log('🛒 ORDER PROCESSED:', orderDetails);

            // Send order confirmation email with Resend
            try {
                console.log('📧 Sending email with Resend...');
                const emailResponse = await fetch('/api/send-order-email-resend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderDetails),
                });

                const emailResult = await emailResponse.json();
                
                if (emailResult.success) {
                    console.log('✅ Email sent successfully with Resend:', emailResult.messageId);
                    alert(`Comanda ta a fost înregistrată! Un email de confirmare a fost trimis la ${formData.email}.`);
                    
                    clearCart();
                    setIsSubmitting(false);

                } else {
                    console.error(emailResult.error.message);
                    alert(`A apărut o eroare la procesarea comenzii. Te rugăm să încerci din nou.`);

                }
            } catch (emailError) {
                console.error('❌ Resend email service error:', emailError);
                alert(`Eroare la trimiterea emailului. Te rugăm să încerci din nou.`);
            }

            setIsSubmitting(false);

        } catch (error) {
            console.error('❌ Order submission error:', error);
            setIsSubmitting(false);
            alert('Eroare la procesarea comenzii. Te rugăm să încerci din nou.');
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <Breadcrumb className="mb-5">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="text-lg">
                                <Link href="/">Pagina principală</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="text-lg">
                                <Link href="/products">Produse</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-lg">Finalizare comandă</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
            </Breadcrumb>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Order Form */}
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Informații de contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="mb-1" htmlFor="name">Nume complet *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                        placeholder="Nume Prenume"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-1" htmlFor="phone">Telefon *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        required
                                        placeholder="+373 69 123 456"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-1" htmlFor="email">Email *</Label>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                required
                                                placeholder="exemplu@email.com"
                                                className={emailError ? 'border-red-500 focus:border-red-500' : ''}
                                                disabled={emailVerificationStep === 'verified'}
                                            />
                                            {emailVerificationStep === 'none' && !emailError && formData.email && (
                                                <Button
                                                    type="button"
                                                    onClick={sendVerificationCode}
                                                    variant="outline"
                                                    size="sm"
                                                    className="whitespace-nowrap"
                                                    disabled={false}
                                                >
                                                    <Mail className="w-4 h-4 mr-1" />
                                                    Verifică
                                                </Button>
                                            )}
                                            {emailVerificationStep === 'verified' && (
                                                <div className="flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                                                    <Check className="w-4 h-4 text-green-600" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {emailError && (
                                            <p className="text-red-500 text-sm">{emailError}</p>
                                        )}
                                        
                                        {emailVerificationStep === 'sending' && (
                                            <div className="flex items-center gap-2 text-blue-600 text-sm">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                Se trimite codul de verificare...
                                            </div>
                                        )}
                                        
                                        {emailVerificationStep === 'sent' && (
                                            <div className="p-3 bg-blue-50 dark:bg-slate-800/80 border rounded-lg">
                                                <div className="flex items-center gap-2 text-sm mb-2">
                                                    <Shield className="w-4 h-4" />
                                                    Cod de verificare trimis la:  {formData.email}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="Introdu codul de 6 cifre"
                                                        value={verificationCode}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                            setVerificationCode(value);
                                                            setVerificationError('');
                                                        }}
                                                        maxLength={6}
                                                        className="text-center font-mono text-lg tracking-widest"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={verifyEmailCode}
                                                        disabled={isVerifying || verificationCode.length !== 6}
                                                        size="sm"
                                                    >
                                                        {isVerifying ? 'Verifică...' : 'Confirmă'}
                                                    </Button>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={sendVerificationCode}
                                                        className="text-blue-600 text-sm hover:underline cursor-pointer"
                                                        disabled={false}
                                                    >
                                                        Retrimite codul
                                                    </button>
                                                    <span className="text-xs text-gray-500">
                                                        Codul expiră în 10 minute
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {emailVerificationStep === 'verified' && (
                                            <div className="flex items-center gap-2 text-green-600 text-sm">
                                                <Check className="w-4 h-4" />
                                                Email verificat cu succes!
                                            </div>
                                        )}
                                        
                                        {verificationError && (
                                            <p className="text-red-500 text-sm">{verificationError}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-1" htmlFor="bankDetails">Rechizite bancare (opțional)</Label>
                                    <Textarea
                                        id="bankDetails"
                                        value={formData.bankDetails}
                                        onChange={(e) => handleInputChange('bankDetails', e.target.value)}
                                        placeholder="IBAN, TVA, cod fiscal, etc."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Metoda de livrare</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange('deliveryMethod', 'delivery')}
                                        className={`p-4 border rounded-lg text-left transition-all ${
                                        formData.deliveryMethod === 'delivery'
                                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-5 h-5 text-cyan-600" />
                                            <div>
                                                <h3 className="font-medium">Livrare la adresă</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Gratuit în Chișinău
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleInputChange('deliveryMethod', 'postalDelivery')}
                                        className={`p-4 border rounded-lg text-left transition-all ${
                                        formData.deliveryMethod === 'postalDelivery'
                                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Package className="w-5 h-5 text-emerald-600" />
                                            <div>
                                                <h3 className="font-medium">Livrare prin poștă</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                +taxă de livrare
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* Address Fields - Required for both delivery methods */}
                                <div className="space-y-4 pt-4">
                                    <div>
                                        <Label className="mb-1" htmlFor="address">Adresa *</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            required
                                            placeholder="Adresa completa pentru livrare"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="mb-1" htmlFor="city">Oraș *</Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                required
                                                placeholder="Chișinău"
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-1" htmlFor="postalCode">Cod poștal</Label>
                                            <Input
                                                id="postalCode"
                                                type="text"
                                                value={formData.postalCode}
                                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                                placeholder="MD-2004"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                <Label className="mb-1" htmlFor="notes">Observații (opțional)</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder="Observații suplimentare pentru comandă..."
                                    rows={3}
                                />
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Sumar comandă ({cartCount} {cartCount === 1 ? 'produs' : 'produse'})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Cart Items */}
                            <div className="space-y-3 max-h-100 overflow-y-auto">
                                {cartItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.id.split('_')[0]}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={50}
                                            height={50}
                                            className="rounded object-cover w-[50px] h-[50px]"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{item.title}</h4>
                                            {item.volume && (
                                                <p className="text-xs text-gray-500">{item.volume}</p>
                                            )}
                                            <p className="text-sm">
                                                {item.quantity} × {item.price} MDL
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">
                                                {(item.price * item.quantity).toFixed(2)} MDL
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                ))}
                            </div>

                            <Separator />

                            {/* Price Breakdown */}
                            <div className="space-y-2">
                                {/* <div className="flex justify-between text-sm">
                                    <span>Subtotal produse:</span>
                                    <span>{totalPrice.toFixed(2)} MDL</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Livrare:</span>
                                    <span>{deliveryFee > 0 ? `${deliveryFee.toFixed(2)} MDL` : 'Gratuit'}</span>
                                </div>
                                <Separator /> */}
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span className="text-cyan-600">{totalPrice.toFixed(2)} MDL</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.name || !formData.phone || !formData.email || 
                                !formData.address || !formData.city || emailError !== '' || emailVerificationStep !== 'verified'}
                                className="w-full"
                                size="lg"
                            >
                                {isSubmitting ? 'Se procesează...' : `Finalizare comandă - ${totalPrice.toFixed(2)} MDL`}
                            </Button>

                            {emailVerificationStep !== 'verified' && formData.email && !emailError && (
                                <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-amber-800 text-sm">
                                        <Shield className="w-4 h-4 inline mr-1" />
                                        Te rugăm să verifici adresa de email pentru a finaliza comanda.
                                    </p>
                                </div>
                            )}

                            <p className="text-sm text-gray-300">
                                * Dupa plasarea comenzii, veți fi contactat în mai puțin de 24 de ore.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
