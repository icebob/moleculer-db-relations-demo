"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { inspect } = require("util");

function print(obj) {
	return inspect(obj, { depth: 10, colors: true });
}

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
				} },
				status: { type: "enum", values: ["pending", "reserved", "completed"], default: "pending" }
			},
			async handler(ctx) {
				const { customerId, items, status } = ctx.params;

				// Create an order
				const order = await ctx.call("orders.create", {
					customerId,
					date: new Date(),
					status
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
		// Clear all database
		await this.broker.call("customers.clear");
		await this.broker.call("products.clear");
		await this.broker.call("orders.clear");
		await this.broker.call("orderItems.clear");

		// Seed DB
		const cus1 = await this.broker.call("customers.create", { name: "John Doe", email: "john.doe@moleculer.services", active: true });
		const cus2 = await this.broker.call("customers.create", { name: "Jane Doe", email: "jane@moleculer.services", active: false });
		const cus3 = await this.broker.call("customers.create", { name: "Bob Smith", email: "b.smith@moleculer.services", active: true });
		const cus4 = await this.broker.call("customers.create", { name: "Adam West", email: "west.a@moleculer.services", active: true });

		const prd1 = await this.broker.call("products.create", { name: "Samsung Galaxy S10 Plus", price: 704 });
		const prd2 = await this.broker.call("products.create", { name: "iPhone 11 Pro", price: 999 });
		const prd3 = await this.broker.call("products.create", { name: "Huawei P30 Pro", price: 679 });
		const prd4 = await this.broker.call("products.create", { name: "Huawei P30 Pro", price: 679 });
		const prd5 = await this.broker.call("products.create", { name: "Huawei P30 Pro", price: 679 });

		await this.Promise.delay(2000);

		// Create orders
		await this.actions.submitOrder({
			customerId: cus1.id,
			items: [
				{ productId: prd1.id, quantity: 2 },
				{ productId: prd2.id, quantity: 1 }
			],
			status: "completed"
		});

		await this.actions.submitOrder({
			customerId: cus2.id,
			items: [
				{ productId: prd3.id, quantity: 5 },
				{ productId: prd5.id, quantity: 10 }
			],
			status: "reserved"
		});

		await this.actions.submitOrder({
			customerId: cus3.id,
			items: [
				{ productId: prd2.id, quantity: 3 },
				{ productId: prd4.id, quantity: 2 }
			]
		});

		await this.actions.submitOrder({
			customerId: cus1.id,
			items: [
				{ productId: prd2.id, quantity: 1 },
				{ productId: prd3.id, quantity: 4 }
			],
			status: "completed"
		});

		const order1 = await this.broker.call("orders.find", { populate: ["customer", "items", "totalPrice"] });
		this.logger.info("Find orders and show references for customer and order items (and product):", print(order1));

		const cusOrders = await this.broker.call("customers.get", { id: cus2.id, populate: ["orders"] });
		this.logger.info("Get a customer and show her orders:", print(cusOrders));
	}
};
