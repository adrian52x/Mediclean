import { OrderDetails } from '@/types';
import { Resend } from 'resend';


// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY_ORDERS);

// Modern email template with better responsive design
const ordersEmailTemplate = (orderDetails: OrderDetails) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmare comandă - Dezinfect</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0891b2; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .items-table th { background: #f1f5f9; font-weight: bold; }
        .total-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .total-final { font-size: 18px; font-weight: bold; color: #0891b2; border-top: 2px solid #e2e8f0; padding-top: 15px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #1e293b; color: white; border-radius: 8px; }
        .contact-info { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .badge { background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Confirmare comandă</h1>
          <h2>Comanda #${orderDetails.orderId}</h2>
          <p>Mulțumim pentru încrederea acordată!</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h3>📋 Detalii comandă</h3>
            <p><strong>Data comenzii:</strong> ${formatDate(orderDetails.timestamp)}</p>
            <p><strong>Număr comandă:</strong> ${orderDetails.orderId}</p>
          </div>

          <div class="order-info">
            <h3>👤 Informații client</h3>
            <p><strong>Nume:</strong> ${orderDetails.customer.name}</p>
            <p><strong>Telefon:</strong> ${orderDetails.customer.phone}</p>
            <p><strong>Email:</strong> ${orderDetails.customer.email}</p>
            <p><strong>Rechizite bancare:</strong> ${orderDetails.customer.bankDetails}</p>
          </div>

          <div class="order-info">
            <h3>🚚 Detalii livrare</h3>
            <p><strong>Metodă:</strong> 
              ${
                orderDetails.delivery.method === 'delivery'
                  ? '🚛 Livrare la adresă'
                  : '📦 Livrare prin poștă'
              }
            </p>
            ${
              orderDetails.delivery.address && typeof orderDetails.delivery.address === 'object'
                ? `
                  <p><strong>Adresa:</strong> ${orderDetails.delivery.address.street}</p>
                  <p><strong>Oraș:</strong> ${orderDetails.delivery.address.city}</p>
                  ${orderDetails.delivery.address.postalCode ? `<p><strong>Cod poștal:</strong> ${orderDetails.delivery.address.postalCode}</p>` : ''}
                `
                : ''
            }
            ${orderDetails.delivery.notes ? `<p><strong>Observații:</strong> ${orderDetails.delivery.notes}</p>` : ''}
          </div>

          <h3>🛒 Produse comandate</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>Volum</th>
                <th>Preț</th>
                <th>Cantitate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items.map(item => `
                <tr>
                  <td><strong>${item.title}</strong></td>
                  <td>${item.volume || '-'}</td>
                  <td>${item.price.toFixed(2)} ${orderDetails.summary.currency}</td>
                  <td>${item.quantity}</td>
                  <td><strong>${item.total.toFixed(2)} ${orderDetails.summary.currency}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            ${
                orderDetails.delivery.method === 'postalDelivery' ? 
                `<div class="total-row">
                  <span><strong>+ Taxă de livrare</strong></span>
                </div>`
                : ''
            }

            <div class="total-row total-final">
              <span>TOTAL DE PLATĂ: </span>
              <span>${orderDetails.summary.totalPrice.toFixed(2)} ${orderDetails.summary.currency}</span>
            </div>
            <p>Veți fi contactat în mai puțin de 24 de ore</p>
          </div>

          <div class="contact-info">
            <h4>📞 Ai întrebări?</h4>
            <p>Nu ezita să ne contactezi pentru orice informații suplimentare:</p>
            <p><strong>Email:</strong> bunic.cristian@gmail.com</p>
            <p><strong>Telefon:</strong> 079410042</p>
          </div>
        </div>

        <div class="footer">
          <h3>🏥 <a href="https://www.dezinfect.md" target="_blank" style="color: white; text-decoration: none;">www.dezinfect.md</a></h3>
          <p>Dezinfectanți profesionali și echipamente medicale</p>
          <p>Str. Nicolae Zelinski 36/6, Chișinău</p>
          <p>© 2025 Dezinfect. Toate drepturile rezervate.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendOrderConfirmationWithResend = async (orderDetails: OrderDetails) => {
    try {
        console.log('📧 Starting Resend email service...');
        console.log('📧 Resend API Key:', process.env.RESEND_API_KEY_ORDERS ? 'Configured' : 'Missing');

        if (!process.env.RESEND_API_KEY_ORDERS) {
            throw new Error('RESEND_API_KEY_ORDERS is not configured');
        }

        const emailResult = await resend.emails.send({
            from: 'Dezinfect-MD <Comenzi@dezinfect.md>',
            to: [orderDetails.customer.email],
            cc: [process.env.CC_EMAIL!], // CC yourself on orders
            subject: `Confirmare comandă #${orderDetails.orderId} - Dezinfect.md`,
            html: ordersEmailTemplate(orderDetails),
        });

        console.log('✅ Resend email result:', emailResult);
        console.log('✅ Resend email ID:', emailResult.data?.id);
        
        // Check if Resend returned an error in the response
        if (emailResult.error) {
            return { 
                success: false, 
                error: emailResult.error,
                service: 'resend'
            };
        }

        // Check if we got data back
        if (!emailResult.data) {
            return { 
                success: false, 
                error: 'No data returned from Resend',
                service: 'resend'
            };
        }
        
        return { 
            success: true, 
            messageId: emailResult.data.id || 'sent',
            service: 'resend',
            fullResponse: emailResult
        };

    } catch (error) {
        return { 
            success: false, 
            error: error,
            service: 'resend'
        };
    }
};


// TO DO
// export const sendConsultationEmailWithResend = async (email: string, subject: string, message: string) => {

// }
