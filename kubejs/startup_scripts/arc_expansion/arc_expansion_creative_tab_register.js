// priority: -1

// 导入Java类
const $CreativeTabRegistryarc_expansion = Java.loadClass(
  "dev.architectury.registry.CreativeTabRegistry"
);

// 创建DLC专属的创造模式物品栏
// "kubejs:arc_expansion"改为你希望注册的物品栏id，"arc_expansion:example_organ_damage"改为你希望作为图标的物品
$CreativeTabRegistryarc_expansion.create(Utils.id("kubejs:arc_expansion"), () =>
  Item.of("arc_expansion:example_organ_damage")
);
