"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "customers",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("customers", {
		name: "customer",
		define: {
			name: Sequelize.STRING,
			email: Sequelize.STRING,
			active: Sequelize.BOOLEAN
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
			"name",
			"email",
			"orders",
			"active"
		],

		// Populates for relations
		populates: {
			async orders(ids, customers, rule, ctx) {
				await Promise.all(customers.map(async cus => {
					cus.orders = await ctx.call("orders.find", {
						query: {
							customerId: cus.id
						}
					});
				}));
			}
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			email: "email",
			active: "boolean"
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
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
