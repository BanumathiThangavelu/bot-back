export function getBotReply(message) {
  const rules = [
    {
      pattern: /where.*order/i,
      reply:
        'Your order is being processed. Track it here: http://track.fake/ORDER123',
    },
    {
      pattern: /return.*policy/i,
      reply:
        'You can return any item within 7 days. Read more at /return-policy',
    },
    {
      pattern: /refund.*status/i,
      reply:
        'Refunds are processed within 5-7 business days after product pickup.',
    },
    {
      pattern: /product.*available|availability/i,
      reply:
        'Please check the product page for the most accurate availability.',
    },
    {
      pattern: /shipping.*details|delivery.*time/i,
      reply:
        'We deliver within 3-5 business days. Free shipping on orders above $50.',
    },
  ];

  for (let rule of rules) {
    if (rule.pattern.test(message)) {
      return rule.reply;
    }
  }

  return "I'm not sure how to help with that. Try asking about order status, returns, or shipping.";
}
