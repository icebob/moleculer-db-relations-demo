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
			"active"
		],

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
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			await this.adapter.insertMany([
				{ name: "John Doe", email: "john.doe@moleculer.services", active: true },
				{ name: "Jane Doe", email: "jane@moleculer.services", active: false },
				{ name: "Bob Smith", email: "b.smith@moleculer.services", active: true },
				{ name: "Adam West", email: "west.a@moleculer.services", active: true }
			]);
		}
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
