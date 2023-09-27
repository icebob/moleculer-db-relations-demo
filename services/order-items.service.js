"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "orderItems",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("orderItems", {
		name: "orderItem",
		define: {
			orderId: Sequelize.INTEGER,
			productId: Sequelize.INTEGER,
			quantity: Sequelize.INTEGER
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
			"orderId",
			"productId",
			"product",
			"quantity"
		],

		// Populates for relations
		populates: {
			// The `productId` field references to a product.
			product: {
				field: "productId",
				action: "products.get",
				params: {
					fields: ["name", "price"]
				}
			},

			// The `orderId` field references to an order.
			order: {
				field: "orderId",
				action: "orders.get",
				params: {
					fields: ["id", "date"]
				}
			}
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			orderId: "number|integer|positive",
			productId: "number|integer|positive",
			quantity: "number|integer|positive"
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
		// await this.adapter.collection.createIndex({ orderId: 1 });
	}
};
