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
			totalPrice: Sequelize.INTEGER,
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
			}
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
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			// await this.adapter.insertMany([]);
		}
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ date: 1 });
		// await this.adapter.collection.createIndex({ status: 1 });
	}
};
