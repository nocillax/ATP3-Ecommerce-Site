/* ──────────────────────────────────────────────────────────── */
/*  Small helpers                                              */
/* ──────────────────────────────────────────────────────────── */

const money = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(n);

/* Render each line item as "<name> (Color) × qty – $price" */
function renderItems(
  items: {
    productName: string;
    productColor?: string;
    quantity: number;
    totalPrice: number;
  }[],
) {
  return items
    .map(
      (i) => `
      <li>
        ${i.productName}${i.productColor ? ` (${i.productColor})` : ''} × ${
          i.quantity
        } — <strong>${money(i.totalPrice)}</strong>
      </li>`,
    )
    .join('');
}

/* ──────────────────────────────────────────────────────────── */
/*  Templates                                                  */
/* ──────────────────────────────────────────────────────────── */

export function buildAdminOrderAlert(
  user: { name: string; email: string },
  order: {
    id: number;
    totalPrice: number;
    orderItems: {
      productName: string;
      productColor?: string;
      quantity: number;
      totalPrice: number;
    }[];
    shippingAddress?: string;
  },
): string {
  return `
    <h2>📦 New Order Received</h2>
    <p><strong>User:</strong> ${user.name} (${user.email})</p>
    <p><strong>Order ID:</strong> #${order.id}</p>

    <h3>Items:</h3>
    <ul>${renderItems(order.orderItems)}</ul>

    <p><strong>Total:</strong> ${money(order.totalPrice)}</p>
    ${
      order.shippingAddress
        ? `<p><strong>Ship To:</strong> ${order.shippingAddress}</p>`
        : ''
    }
    <p>Please log in to the admin panel to process this order.</p>
  `;
}

export function buildOrderCancelledEmail(
  user: { name: string },
  order: { id: number },
): string {
  return `
    <h2>Hello ${user.name},</h2>
    <p>Your order <strong>#${order.id}</strong> has been cancelled.</p>
    <p>If this was a mistake, contact support and we’ll help you sort it out.</p>
    <br/>
    <p>— The NCX Team</p>
  `;
}

export function buildOrderReceivedEmail(
  user: { name: string },
  order: {
    id: number;
    status: string;
    totalPrice: number;
    orderItems: {
      productName: string;
      productColor?: string;
      quantity: number;
      totalPrice: number;
    }[];
  },
): string {
  return `
    <h2>Hello ${user.name},</h2>
    <p>Thanks for shopping with us! We’ve received your order.</p>

    <h3>Order Summary (#${order.id})</h3>
    <ul>${renderItems(order.orderItems)}</ul>

    <p><strong>Total Paid:</strong> ${money(order.totalPrice)}</p>
    <p><strong>Status:</strong> ${order.status}</p>

    <p>You’ll get another email once it ships.</p>
    <br/>
    <p>— The NCX Team</p>
  `;
}

export function buildOrderStatusUpdatedEmail(
  user: { name: string },
  order: { id: number; status: string },
): string {
  return `
    <h2>Hello ${user.name},</h2>
    <p>Your order <strong>#${order.id}</strong> is now: <strong>${order.status}</strong>.</p>
    <p>Thank you for choosing NCX!</p>
    <br/>
    <p>— The NCX Team</p>
  `;
}
