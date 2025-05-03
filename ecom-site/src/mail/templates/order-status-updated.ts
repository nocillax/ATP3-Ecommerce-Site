export function buildOrderStatusUpdatedEmail(user: { name: string }, order: { id: number, status: string }): string {
  return `
    <h2>Hello ${user.name},</h2>
    <p>Your order <strong>#${order.id}</strong> has been updated to status: <strong>${order.status}</strong>.</p>

    <p>Thank you for shopping with us. We’ll keep you updated on the next steps.</p>

    <br/>
    <p>— The NCX Team</p>
  `;
}
