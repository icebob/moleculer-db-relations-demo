"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "demo",

	dependencies: ["customers", "products", "orders", "orderItems"],

	actions: {
		submitOrder: {
			params: {
				customerId: "number",
				items: { type: "array", items: "object", properties: {
					productId: "number",
					quantity: "number"
				}
				}
			},
			async handler(ctx) {
				const { customerId, items } = ctx.params;

				// Create an order
				const order = await ctx.call("orders.create", {
					customerId,
					date: new Date(),
					status: "pending"
				});

				await Promise.all(items.map(item => ctx.call("orderItems.create", {
					orderId: order.id,
					productId: item.productId,
					quantity: item.quantity
				})));
			}
		}
	},

	async started() {
		this.logger.info("Create a new order...");
		// Submit a new order
		await this.actions.submitOrder({
			customerId: 1,
			items: [
				{ productId: 1, quantity: 2 },
				{ productId: 2, quantity: 1 }
			]
		});
	}
};
