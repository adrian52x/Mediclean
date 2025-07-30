'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, MapPin, User } from 'lucide-react';
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

type DeliveryMethod = 'delivery' | 'pickup';

interface OrderFormData {
    // Customer Info
    name: string;
    phone: string;
    email: string;
    // Delivery
    deliveryMethod: DeliveryMethod;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
}

const pretLivrare = 100; // Delivery fee

export function CheckoutForm() {
    const router = useRouter();
    const { cartItems, cartCount, totalPrice, clearCart } = useCartStore();
    
    const [formData, setFormData] = useState<OrderFormData>({
        name: '',
        phone: '',
        email: '',
        deliveryMethod: 'delivery',
        address: '',
        city: '',
        postalCode: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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
                Adaugă produse în coș pentru a continua cu comanda.
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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock order processing - log order details
            const orderDetails = {
                orderId: `MED-${Date.now()}`,
                timestamp: new Date().toISOString(),
                customer: {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email
                },
                delivery: {
                    method: formData.deliveryMethod,
                    address: formData.deliveryMethod === 'delivery' ? {
                        street: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode
                    } : 'Colectare de la magazin',
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
                    deliveryFee: formData.deliveryMethod === 'delivery' ? 50 : 0,
                    finalTotal: totalPrice + (formData.deliveryMethod === 'delivery' ? 50 : 0),
                    currency: 'MDL'
                }
            };

            console.log('🛒 ORDER SUBMITTED:', orderDetails);

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
                } else {
                    console.error('❌ Failed to send email with Resend:', emailResult.error);
                    // Continue with order processing even if email fails
                }
            } catch (emailError) {
                console.error('❌ Resend email service error:', emailError);
                // Continue with order processing even if email fails
            }

            // Clear cart and redirect to success page
            clearCart();
            setIsSubmitting(false);
            
            // In a real app, you'd redirect to an order confirmation page
            alert(`Comanda ta #${orderDetails.orderId} a fost înregistrată! Un email de confirmare a fost trimis la ${formData.email}.`);
            router.push('/');

        } catch (error) {
            console.error('❌ Order submission error:', error);
            setIsSubmitting(false);
            alert('A apărut o eroare la procesarea comenzii. Te rugăm să încerci din nou.');
        }
    }

    const deliveryFee = formData.deliveryMethod === 'delivery' ? 50 : 0;
    const finalTotal = totalPrice + deliveryFee;

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
                            <BreadcrumbPage className="text-lg">Checkout</BreadcrumbPage>
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
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                        placeholder="exemplu@email.com"
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
                                                <h3 className="font-medium">Livrare</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                +{pretLivrare} MDL
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleInputChange('deliveryMethod', 'pickup')}
                                        className={`p-4 border rounded-lg text-left transition-all ${
                                        formData.deliveryMethod === 'pickup'
                                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-emerald-600" />
                                            <div>
                                                <h3 className="font-medium">Colectare</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Gratuit
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* Address Fields for Delivery */}
                                {formData.deliveryMethod === 'delivery' && (
                                <div className="space-y-4 pt-4">
                                    <div>
                                        <Label className="mb-1" htmlFor="address">Adresa *</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            required={formData.deliveryMethod === 'delivery'}
                                            placeholder="Strada Alexandru cel Bun 123, ap. 4"
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
                                                required={formData.deliveryMethod === 'delivery'}
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
                                )}

                                {/* Pickup Address Info */}
                                {formData.deliveryMethod === 'pickup' && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <h4 className="font-medium mb-2">Adresa magazinului:</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                    str. Medicina 15, Chișinău, MD-2004<br />
                                    </p>
                                </div>
                                )}

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
                                <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                                ))}
                            </div>

                            <Separator />

                            {/* Price Breakdown */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal produse:</span>
                                    <span>{totalPrice.toFixed(2)} MDL</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Livrare:</span>
                                    <span>{deliveryFee > 0 ? `${deliveryFee.toFixed(2)} MDL` : 'Gratuit'}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span className="text-cyan-600">{finalTotal.toFixed(2)} MDL</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.name || !formData.phone || !formData.email || 
                                (formData.deliveryMethod === 'delivery' && (!formData.address || !formData.city))}
                                className="w-full"
                                size="lg"
                            >
                                {isSubmitting ? 'Se procesează...' : `Finalizare comandă - ${finalTotal.toFixed(2)} MDL`}
                            </Button>

                            <p className="text-xs text-gray-500 text-center">
                                Prin plasarea comenzii ești de acord cu termenii și condițiile noastre.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
