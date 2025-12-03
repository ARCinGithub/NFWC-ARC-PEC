// priority: 9

/**
 * 造成伤害处理策略
 * 对应.tag('kubejs:damage')
 * @constant
 * @type {Object<string,function(Internal.LivingHurtEvent, organ, EntityHurtCustomModel):void>}
 */
const dlcTemplateOrganPlayerDamageStrategies = {
	// 示例器官-伤害
	"arc_expansion:example_organ_damage": function (event, organ, data) {
		// 造成的伤害变为110%
		event.amount *= 1.1;
	},
};

var assign_organ_player_damage = Object.assign(
	organPlayerDamageStrategies,
	dlcTemplateOrganPlayerDamageStrategies,
);

/**
 * 造成伤害唯一处理策略
 * 对应.tag('kubejs:damage_only')
 * @constant
 * @type {Object<string,function(Internal.LivingHurtEvent, organ, EntityHurtCustomModel):void>}
 */
const dlcTemplateOrganPlayerDamageOnlyStrategies = {
	// 示例器官-唯一伤害
	"arc_expansion:example_organ_damage_only": function (event, organ, data) {
		// 如果仍在冷却中，则不执行
		let player = event.source.player;
		if (player.getCooldowns().isOnCooldown(Item.of(organ.id))) {
			return;
		}
		// 增加冷却时间，单位为tick
		// 如果没有冷却时间，会导致死循环
		player.addItemCooldown(organ.id, 20);
		// 获取被攻击的实体
		let entity = event.entity;
		// 获取周围实体
		let entityList = getLivingWithinRadius(
			entity.getLevel(),
			entity.position(),
			3,
		);
		// 遍历实体列表
		entityList.forEach((entity) => {
			// 如果没有这个，会攻击到非生物实体，比如掉落物
			if (entity.isLiving()) {
				// 延迟一刻执行，这样可以让训练假人正常显示伤害
				entity.getServer().scheduleInTicks(1, () => {
					// 攻击,DamageSource为伤害源，后一个数值是伤害数值
					entity.attack(
						DamageSource.playerAttack(player),
						event.amount * 0.1,
					);
				});
			}
		});
	},

	// “未照耀的荣光”
	"arc_expansion:unbrilliant_glory": function (event, organ, data) {
		let player = event.source.player;

		if (player.hasEffect("arc_expansion:unbrilliant_glory_effect")) {
			let entityList = getLivingWithinRadius(
				player.getLevel(),
				new Vec3(player.x, player.y, player.z),
				6,
			); // 获取6格内生物
			let look = player.getViewVector(1.0);
			entityList.forEach((entity) => {
				if (entity.isLiving && entity.id != player.id) {
					let entityVec = new Vec3(entity.x, entity.y, entity.z);
					let playerVec = new Vec3(player.x, player.y, player.z);
					let vecToEntity = entityVec.subtract(playerVec);
					let normalizedVecToEntity = vecToEntity.normalize();
					let dotProduct = look.dot(normalizedVecToEntity);
					if (dotProduct > 0) {
						entity.getServer().scheduleInTicks(1, () => {
							entity.attack(
								DamageSource.playerAttack(player),
								event.amount * 2.5, // 造成 11% 攻击力的真实伤害
							);
						});
						entity.getServer().scheduleInTicks(1, () => {
							entity.attack(
								DamageSource.playerAttack(player)
									.bypassArmor()
									.bypassEnchantments()
									.bypassInvul()
									.bypassMagic(),
								player.getAttributeTotalValue(
									"minecraft:generic.attack_damage",
								) * 0.11, // 造成 11% 攻击力的真实伤害
							);
						});
					}
				}
			});
		} else {
			event.amount *= 0.75;
		}
	},

	// “策略：熔毁”
	"arc_expansion:stratagem_meltdown": function (event, organ, data) {
		let player = event.source.player;

		if (player.hasEffect("arc_expansion:stratagem_meltdown_effect")) {
			if (
				event.player.getHealth() + event.amount * 0.5 <
				event.player.getMaxHealth()
			) {
				// 直接设置玩家的新血量
				event.player.setHealth(
					event.player.getHealth() + event.amount * 0.5,
				);
			} else {
				event.player.setHealth(event.player.getMaxHealth());
			}
			let entityList = getLivingWithinRadius(
				player.getLevel(),
				new Vec3(player.x, player.y, player.z),
				3,
			); // 获取3格内生物
			entityList.forEach((entity) => {
				if (entity.isLiving()) {
					entity.getServer().scheduleInTicks(1, () => {
						entity.attack(
							DamageSource.playerAttack(player)
								.bypassArmor()
								.bypassEnchantments()
								.bypassInvul()
								.bypassMagic(),
							(event.amount *= 3.8),
						);
					});
				}
			});
		} else {
			event.amount *= 1.15;
		}
	},
};

var assign_organ_player_damage_only = Object.assign(
	organPlayerDamageOnlyStrategies,
	dlcTemplateOrganPlayerDamageOnlyStrategies,
);
