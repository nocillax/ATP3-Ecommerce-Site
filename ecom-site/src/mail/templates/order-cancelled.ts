export function buildOrderCancelledEmail(user: { name: string }, order: { id: number }): string {
  return `
    <h2>Hello ${user.name},</h2>
    <p>Your order <strong>#${order.id}</strong> has been successfully cancelled.</p>
    <p>If this was a mistake, please contact support immediately.</p>
    <br/>
    <p>— The NCX Team</p>
  `;
}
