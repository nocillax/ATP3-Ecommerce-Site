export function buildOrderReceivedEmail(user: { name: string }, order: { id: number, status: string, totalPrice: number }): string {
  return `
    <h2>Hello ${user.name},</h2>
    <p>Thank you for placing your order! Your order has been recieved.</p>

    <h3>Your Order Details:</h3>
    <ul>
      <li><strong>Order ID:</strong> ${order.id}</li>
      <li><strong>Status:</strong> ${order.status}</li>
      <li><strong>Total Price:</strong> $${order.totalPrice}</li>
    </ul>

    <p>We will notify you when your order is confirmed and shipped.</p>

    <br/>
    <p>— The NCX Team</p>
  `;
}
