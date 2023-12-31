"use strict";

const DbMixin = require("../mixins/db.mixin");

module.exports = {
	name: "products",

	mixins: [DbMixin("mongodb://localhost:27017/mol-demo-products", "products")],

	settings: {
		idField: "id",

		// Available fields in the responses
		fields: [
			"id",
			"name",
			"price",
			"tags"
		],

		// Populates for relations
		populates: {
			async tags(ids, products, rule, ctx) {
				await Promise.all(products.map(async prd => {
					const res = await ctx.call("product-tags.find", {
						query: {
							productId: prd.id
						},
						populate: ["tag"]
					});

					prd.tags = res.map(item => item.tag.name);
				}));
			},
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			price: "number|positive"
		}
	}
};
