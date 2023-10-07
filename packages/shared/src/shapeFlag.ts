const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3, // 1000
  SLOT_CHILDREN = 1 << 4,
}

export { ShapeFlags }

// 位运算的方式来查找和设置
// element => 0001
// stateful_component => 0010
// text_children => 0100
// array_children => 1000

// 修改
// 0000 ｜ 0001 = 0001
// 0000 ｜ 0010 = 0010

// 查找
// 0001 & 0001 = 0001
// 0010 & 0001 = 0000

// 0001 | 0100 = 0101
