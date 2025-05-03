export function buildAdminOrderAlert(user: { name: string, email: string }, order: { id: number, totalPrice: number }): string {
  return `
    <h2>📦 New Order Received</h2>
    <p><strong>User:</strong> ${user.name} (${user.email})</p>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Total Price:</strong> $${order.totalPrice}</p>
    <p>Login to the admin panel to manage the order.</p>
  `;
}
