<template>
  <div class="equipment-entry-container">
    <el-breadcrumb separator="/" class="page-header">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/equipment/new-list' }">设备列表（新）</el-breadcrumb-item>
      <el-breadcrumb-item>设备录入</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="hover" class="mt-4">
      <div slot="header" class="flex justify-between items-center">
        <h2>设备信息录入</h2>
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-check"
            :loading="submitLoading"
            @click="handleSubmit"
          >
            保存
          </el-button>
          <el-button
            icon="el-icon-back"
            @click="handleCancel"
          >
            取消
          </el-button>
        </el-button-group>
      </div>

      <!-- 标签页切换 -->
      <el-tabs v-model="activeTab" class="mt-4">
        <el-tab-pane label="基础信息" name="basic" />
        <el-tab-pane label="详细信息" name="detail" />
        <el-tab-pane label="设备附件" name="attachment" />
      </el-tabs>

      <!-- 基础信息表单 -->
      <el-form
        ref="equipmentForm"
        :model="equipmentForm"
        :rules="formRules"
        label-width="120px"
        class="mt-6"
      >
        <!-- 基础信息区域 -->
        <el-form-item label="设备名称" prop="name">
          <el-input
            v-model="equipmentForm.name"
            placeholder="请输入设备名称"
            clearable
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="设备类型" prop="type">
          <el-select
            v-model="equipmentForm.type"
            placeholder="请选择设备类型"
            clearable
          >
            <el-option label="服务器" value="server" />
            <el-option label="交换机" value="switch" />
            <el-option label="路由器" value="router" />
            <el-option label="防火墙" value="firewall" />
            <el-option label="存储设备" value="storage" />
            <el-option label="其他设备" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="设备编号" prop="code">
          <el-input
            v-model="equipmentForm.code"
            placeholder="请输入设备编号"
            clearable
            maxlength="30"
          />
          <div class="el-form-item__help">建议格式：设备类型-编号（如：SERVER-001）</div>
        </el-form-item>

        <el-form-item label="序列号" prop="serialNumber">
          <el-input
            v-model="equipmentForm.serialNumber"
            placeholder="请输入设备序列号"
            clearable
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="制造商" prop="manufacturer">
          <el-input
            v-model="equipmentForm.manufacturer"
            placeholder="请输入制造商"
            clearable
            maxlength="50"
          />
        </el-form-item>

        <!-- 设备规格表格 -->
        <el-form-item label="设备规格">
          <el-table
            :data="specList"
            border
            style="width: 100%; margin-bottom: 16px;"
          >
            <el-table-column
              prop="index"
              label="序号"
              width="80"
              align="center"
            />
            <el-table-column
              prop="name"
              label="规格名称"
              width="150"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.name"
                  placeholder="请输入规格名称"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="规格值"
              width="150"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.value"
                  placeholder="请输入规格值"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="unit"
              label="单位"
              width="100"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.unit"
                  placeholder="请输入单位"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  size="small"
                  @click="handleDeleteSpec(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>

          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAddSpec"
          >
            添加规格
          </el-button>
        </el-form-item>

        <!-- 表单底部按钮 -->
        <el-form-item class="form-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入全局存储，用于共享设备数据
import equipmentStore from '@/store/equipment'

export default {
  name: 'EquipmentEntry',
  data() {
    return {
      activeTab: 'basic',
      submitLoading: false,
      equipmentForm: {
        name: '',
        type: '',
        code: '',
        serialNumber: '',
        manufacturer: '',
        model: '',
        purchaseDate: '',
        warrantyPeriod: '',
        location: '',
        status: 'inUse'
      },
      formRules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ]
      },
      specList: [
        { index: 1, name: '尺寸', value: '40cm', unit: 'cm' },
        { index: 2, name: '重量', value: '5kg', unit: 'kg' }
      ]
    }
  },
  methods: {
    // 添加规格行
    handleAddSpec() {
      const newIndex = this.specList.length + 1
      this.specList.push({
        index: newIndex,
        name: '',
        value: '',
        unit: ''
      })
    },
    // 删除规格行
    handleDeleteSpec(index) {
      this.specList.splice(index, 1)
      // 重新排序序号
      this.specList.forEach((item, i) => {
        item.index = i + 1
      })
    },
    // 提交表单
    handleSubmit() {
      this.$refs.equipmentForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true

          // 构造新设备数据
          const newDevice = {
            name: this.equipmentForm.name,
            type: this.equipmentForm.type,
            code: this.equipmentForm.code,
            manufacturer: this.equipmentForm.manufacturer,
            status: this.equipmentForm.status,
            purchaseDate: this.equipmentForm.purchaseDate || new Date().toISOString().split('T')[0],
            warrantyPeriod: this.equipmentForm.warrantyPeriod || '1年'
          }
          // 保存到全局存储
          equipmentStore.addEquipment(newDevice)
          setTimeout(() => {
            this.$message.success('设备信息提交成功！')
            this.submitLoading = false
            this.$router.push('/equipment/new-list')
          }, 1000)
        } else {
          this.$message.error('请填写必填字段')
        }
      })
    },
    handleSaveDraft() {
      this.$message.info('草稿已保存')
    },
    handleCancel() {
      this.$router.push('/equipment/new-list')
    }
  }
}
</script>

<style scoped>
.equipment-entry-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 16px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
