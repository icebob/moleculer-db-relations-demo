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
				customerId: "string",
				items: {
					type: "array", items: "object", properties: {
						productId: "string",
						quantity: "number"
					}
				},
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

	methods: {
		async doTest() {		// Clear all database
			await this.broker.call("tags.clear");
			await this.broker.call("customers.clear");
			await this.broker.call("products.clear");
			await this.broker.call("orders.clear");
			await this.broker.call("orderItems.clear");

			// Seed DB
			const cus1 = await this.broker.call("customers.create", { name: "John Doe", email: "john.doe@moleculer.services", active: true });
			const cus2 = await this.broker.call("customers.create", { name: "Jane Doe", email: "jane@moleculer.services", active: false });
			const cus3 = await this.broker.call("customers.create", { name: "Bob Smith", email: "b.smith@moleculer.services", active: true });
			const cus4 = await this.broker.call("customers.create", { name: "Adam West", email: "west.a@moleculer.services", active: true });

			const prd1 = await this.broker.call("products.create", { name: "Samsung Galaxy S21", price: 1199 });
			const prd2 = await this.broker.call("products.create", { name: "iPhone 13 Pro Max", price: 1099 });
			const prd3 = await this.broker.call("products.create", { name: "Google Pixel 6 Pro", price: 899 });
			const prd4 = await this.broker.call("products.create", { name: "Samsung Galaxy S23", price: 1669 });
			const prd5 = await this.broker.call("products.create", { name: "Xiaomi Mi 11 Ultra", price: 1199 });

			const tag1 = await this.broker.call("tags.create", { name: "Mobile phone" });
			const tag2 = await this.broker.call("tags.create", { name: "Samsung" });
			const tag3 = await this.broker.call("tags.create", { name: "Apple" });
			const tag4 = await this.broker.call("tags.create", { name: "Google" });
			const tag5 = await this.broker.call("tags.create", { name: "Xiaomi" });

			await this.broker.call("product-tags.create", { productId: prd1.id, tagId: tag1.id });
			await this.broker.call("product-tags.create", { productId: prd1.id, tagId: tag2.id });
			await this.broker.call("product-tags.create", { productId: prd2.id, tagId: tag1.id });
			await this.broker.call("product-tags.create", { productId: prd2.id, tagId: tag3.id });
			await this.broker.call("product-tags.create", { productId: prd3.id, tagId: tag1.id });
			await this.broker.call("product-tags.create", { productId: prd3.id, tagId: tag4.id });
			await this.broker.call("product-tags.create", { productId: prd4.id, tagId: tag1.id });
			await this.broker.call("product-tags.create", { productId: prd4.id, tagId: tag2.id });
			await this.broker.call("product-tags.create", { productId: prd5.id, tagId: tag1.id });
			await this.broker.call("product-tags.create", { productId: prd5.id, tagId: tag5.id });

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

			const order1 = await this.broker.call("orders.find", { populate: ["customer", "items", "totalPrice", "orderNumber"] });
			this.logger.info("Find orders and show references for customer and order items (and product):", print(order1));

			const cusOrders = await this.broker.call("customers.get", { id: cus2.id, populate: ["orders", "orderCount"] });
			this.logger.info("Get a customer and show her orders:", print(cusOrders));

			const tagProducts = await this.broker.call("tags.get", { id: tag2.id, populate: ["products"] });
			this.logger.info("Get a tag with products:", print(tagProducts));

		}
	},

	async started() {
		this.doTest();
	},
};
