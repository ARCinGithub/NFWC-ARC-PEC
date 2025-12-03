ServerEvents.recipes((event) => {
	// “未照耀的荣光”
	event.recipes.summoningrituals
		.altar("kubejs:ritual_catalyst")
		.id("arc_expansion:unbrilliant_glory")
		.input("4x minecraft:gold_block")
		.input("4x cataclysm:ignitium_ingot")
		.input("minecraft:golden_sword")
		.input("4x createaddition:gold_rod")
		.itemOutput("arc_expansion:unbrilliant_glory")
		.recipeTime(500);
});
