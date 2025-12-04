// priority: 9

/**
 * 玩家Tick秒级策略
 * 是的，这玩意是每秒而非每刻执行一次
 * 对应.tag('kubejs:player_tick')
 * @constant
 * @type {Object<string,function(Internal.SimplePlayerEventJS, organ):void>}
 */
const dlcTemplateOrganPlayerTickStrategies = {
	// 示例器官-玩家刻
	"arc_expansion:example_organ_player_tick": function (event, organ) {
		// 获取并增加饥饿值，注意最大值为20
		event.player.setFoodLevel(
			Math.max(event.player.getFoodLevel() + 1, 20),
		);
	},

	// “策略：熔毁”
	"arc_expansion:stratagem_meltdown": function (event, organ) {
		let player = event.player;
		if (!player.hasEffect("arc_expansion:stratagem_meltdown_effect")) {
			return;
		}
		player.potionEffects.add(
			"arc_expansion:stratagem_meltdown_effect",
			20 * 2,
			0,
			false,
			false,
		);

		// 确保新血量不低于 4
		if (event.player.getHealth() - 8 > 4) {
			// 直接设置玩家的新血量
			event.player.setHealth(event.player.getHealth() - 8);
		} else {
			event.player.setHealth(4);
		}
	},
};

var assign_organ_player_tick = Object.assign(
	organPlayerTickStrategies,
	dlcTemplateOrganPlayerTickStrategies,
);

/**
 * 玩家Tick秒级唯一策略
 * 是的，这玩意是每秒而非每刻执行一次
 * 对应.tag('kubejs:player_tick_only')
 * @constant
 * @type {Object<string,function(Internal.SimplePlayerEventJS, organ):void>}
 */
const dlcTemplateOrganPlayerTickOnlyStrategies = {
	// 示例器官-唯一玩家刻
	"arc_expansion:example_organ_player_tick_only": function (event, organ) {
		// 获取玩家
		let player = event.player;
		// 如果玩家在水中，则执行以下逻辑
		if (player.isUnderWater()) {
			// 给予水下呼吸
			player.potionEffects.add("minecraft:water_breathing", 20, 0);
		}
	},
};

var assign_organ_player_tick_only = Object.assign(
	organPlayerTickOnlyStrategies,
	dlcTemplateOrganPlayerTickOnlyStrategies,
);
