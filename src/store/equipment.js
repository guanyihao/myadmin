// 加的存储文件
export default {
  // 存储设备列表数据
  equipmentList: [
    {
      id: 1,
      name: '服务器A',
      code: 'SERVER-001',
      type: 'server',
      manufacturer: '华为',
      status: 'inUse',
      purchaseDate: '2023-01-15',
      warrantyPeriod: '3年'
    },
    {
      id: 2,
      name: '交换机B',
      code: 'SWITCH-001',
      type: 'switch',
      manufacturer: '华三',
      status: 'idle',
      purchaseDate: '2023-03-20',
      warrantyPeriod: '2年'
    },
    {
      id: 3,
      name: '路由器C',
      code: 'ROUTER-001',
      type: 'router',
      manufacturer: '思科',
      status: 'maintenance',
      purchaseDate: '2022-11-10',
      warrantyPeriod: '1年'
    }
  ],
  addEquipment(newDevice) {
    // 生成唯一ID（用时间戳确保不重复）
    newDevice.id = Date.now()
    // 默认状态设为“使用中”
    newDevice.status = 'inUse'
    // 添加到列表
    this.equipmentList.push(newDevice)
  }
}
