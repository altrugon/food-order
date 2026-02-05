export function simulateOrder(order: any, notify: (o: any) => void) {
  const states = ["Preparing", "Out for Delivery", "Delivered"];
  let i = 0;

  const interval = setInterval(() => {
    order.status = states[i++];
    notify(order);

    if (i === states.length) clearInterval(interval);
  }, 3000);
}
