"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "orders",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("orders", {
		name: "order",
		define: {
			date: Sequelize.DATE,
			customerId: Sequelize.INTEGER,
			status: Sequelize.STRING,

		}
	})],

	/**
	 * Settings
	 */
	settings: {
		idField: "id",

		// Available fields in the responses
		fields: [
			"id",
			"date",
			"customerId",
			"customer",
			"items",
			"totalPrice",
			"status"
		],

		// Populates for relations
		populates: {
			// The `customerId` field references to a customer.
			customer: {
				field: "customerId",
				action: "customers.get",
				params: {
					fields: ["name", "email"]
				}
			},

			/* Get the items from the `orderItems` service */
			async items(ids, orders, rule, ctx) {
				await Promise.all(orders.map(async order => {
					order.items = await ctx.call("orderItems.find", {
						query: {
							orderId: order.id
						},
						populate: ["product"]
					});
				}));
			},

			/* It's a virtual field, we calculate the value */
			async totalPrice(ids, orders, rule, ctx) {
				await Promise.all(orders.map(async order => {
					const items = await ctx.call("orderItems.find", {
						query: {
							orderId: order.id
						},
						populate: ["product"]
					});

					order.totalPrice = items.reduce((a, b) => a + b.product.price * b.quantity, 0);
				}));
			},
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			date: "date",
			customerId: "number|integer|positive",
			// it's virtual totalPrice: "number|positive",
			status: "string|default:pending"
		}
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ date: 1 });
		// await this.adapter.collection.createIndex({ status: 1 });
	}
};
