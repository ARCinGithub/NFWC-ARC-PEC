// priority: -50

StartupEvents.registry("mob_effect", (event) => {
	event
		.create("arc_expansion:unbrilliant_glory_effect")
		.beneficial()
		.color(Color.YELLOW_DYE);
});
