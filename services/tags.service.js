"use strict";

const DbMixin = require("../mixins/db.mixin");

module.exports = {
	name: "tags",

	mixins: [DbMixin("mongodb://localhost:27017/mol-demo-tags", "tags")],

	settings: {
		idField: "id",

		// Available fields in the responses
		fields: [
			"id",
			"name",
			"products"
		],

		// Populates for relations
		populates: {
			async products(ids, tags, rule, ctx) {
				await Promise.all(tags.map(async prd => {
					const res = await ctx.call("product-tags.find", {
						query: {
							tagId: prd.id
						},
						populate: ["product"]
					});

					prd.products = res.map(item => item.product);
				}));
			},
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|trim|no-empty"
		}
	}
};
