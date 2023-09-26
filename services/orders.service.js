"use strict";

const DbMixin = require("../mixins/db.mixin");

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
	mixins: [DbMixin("orders")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"date",
			"customerId",
			"totalPrice",
			"status"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			date: "date",
			customerId: "string",
			totalPrice: "number|positive",
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
