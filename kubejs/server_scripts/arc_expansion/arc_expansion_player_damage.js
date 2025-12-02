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
		// ====================== 基础伤害提升 +150% ======================
		event.amount *= 2.5;

		let player = event.source.player;
		let entity = event.entity;

		if (!player || !entity) return;

		let playerPos = new Vec3(player.x, player.y, player.z);
		let entityPos = entity.position();

		// ====================== 距离判定（<6格） ======================
		let distance = entityPos.distanceTo(playerPos);
		if (distance >= 6) return;

		// ====================== 前半圆判定 ======================
		// 玩家视角方向（look vector）
		let look = player.getViewVector(1.0);
		// 玩家 → 实体 方向
		let dir = entityPos.subtract(playerPos).normalize();

		// dot > 0 → 实体在玩家正前方180°区域内
		let dot = look.x * dir.x + look.y * dir.y + look.z * dir.z;
		if (dot <= 0) return; // 在背后，不触发真实伤害

		// ====================== 真实伤害触发 ======================
		event.source.bypassArmor();
		event.source.bypassEnchantments();
		event.source.bypassInvul();
		event.source.bypassMagic();

		let bonus =
			player.getAttributeTotalValue("minecraft:generic.attack_damage") *
			0.11;

		entity.attack(
			DamageSource.playerAttack(player)
				.bypassArmor()
				.bypassEnchantments()
				.bypassInvul()
				.bypassMagic(),
			bonus,
		);

		// ====================== 金色半圆粒子效果 ======================
		let level = player.getLevel();
		let particle = "minecraft:glow"; // 金色效果推荐使用 glow

		let steps = 40; // 半圆粒子分段数量（越高越密集）

		for (let i = 0; i < steps; i++) {
			// 半圆角度：-90°～+90°
			let angle = -Math.PI / 2 + (i / (steps - 1)) * Math.PI;

			// 玩家朝向（水平）
			let yaw = player.getYRot() * (Math.PI / 180);

			// 粒子在玩家前方半圆弧上的方向
			let dirX = Math.cos(angle + yaw);
			let dirZ = Math.sin(angle + yaw);

			// 粒子生成位置（稍微向前 + 提高一点）
			let startX = player.x + dirX * 0.8;
			let startY = player.y + 1.2;
			let startZ = player.z + dirZ * 0.8;

			// 粒子速度（向外扩散）
			let speed = 0.2;
			let velX = dirX * speed;
			let velZ = dirZ * speed;

			// 生成粒子
			level.spawnParticle(
				particle,
				false,
				startX,
				startY,
				startZ,
				velX,
				0.02,
				velZ,
			);
		}
	},
};

var assign_organ_player_damage_only = Object.assign(
	organPlayerDamageOnlyStrategies,
	dlcTemplateOrganPlayerDamageOnlyStrategies,
);
