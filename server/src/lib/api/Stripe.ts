import stripe from "stripe";

const client = new stripe(`${process.env.S_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

export const Stripe = {
  connect: async (code: string): Promise<stripe.OAuthToken> => {
    const response = await client.oauth.token({
      grant_type: "authorization_code",
      code,
    });
    return response;
  },
  disconnect: async (stripeUserId: string): Promise<stripe.OAuthDeauthorization> => {
    const result = await client.oauth.deauthorize({
      client_id: `${process.env.S_CLIENT_ID}`,
      stripe_user_id: stripeUserId,
    });
    return result;
  },
  charge: async (amount: number, source: string, stripeAccount: string): Promise<void> => {
    const result = await client.charges.create(
      {
        amount,
        currency: "usd",
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripeAccount,
      }
    );

    if (result.status !== "succeeded") {
      throw new Error("Failed to create charge with Stripe!");
    }
  },
};
