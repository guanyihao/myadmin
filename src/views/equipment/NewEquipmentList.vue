<template>
  <div class="equipment-list-container">
    <el-breadcrumb separator="/" class="page-header">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备列表（新）</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="hover" class="mt-4">
      <div slot="header" class="flex justify-between items-center">
        <h2>设备列表（新）</h2>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          新增设备
        </el-button>
      </div>

      <el-form
        :inline="true"
        :model="searchForm"
        class="search-form"
        label-width="80px"
      >
        <el-form-item label="设备名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入设备名称"
            clearable
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择设备类型"
            clearable
            style="width: 200px;"
          >
            <el-option label="服务器" value="server" />
            <el-option label="交换机" value="switch" />
            <el-option label="路由器" value="router" />
            <el-option label="防火墙" value="firewall" />
            <el-option label="存储设备" value="storage" />
            <el-option label="其他设备" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择设备状态"
            clearable
            style="width: 200px;"
          >
            <el-option label="使用中" value="inUse" />
            <el-option label="闲置" value="idle" />
            <el-option label="维修中" value="maintenance" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="equipmentList"
        border
        style="width: 100%; margin-top: 16px;"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        />
        <el-table-column
          prop="name"
          label="设备名称"
          width="150"
        />
        <el-table-column
          prop="code"
          label="设备编号"
          width="150"
        />
        <el-table-column
          prop="type"
          label="设备类型"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="manufacturer"
          label="制造商"
          width="150"
        />
        <el-table-column
          prop="status"
          label="设备状态"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="purchaseDate"
          label="购买日期"
          width="150"
        />
        <el-table-column
          prop="warrantyPeriod"
          label="保修期限"
          width="120"
        />
        <el-table-column
          label="操作"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <div class="operation-buttons">
              <el-button
                type="text"
                icon="el-icon-view"
                size="small"
                @click="handleView(scope.row)"
              >查看</el-button>
              <el-button
                type="text"
                icon="el-icon-edit"
                size="small"
                class="edit-btn"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                size="small"
                class="delete-btn"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :page-sizes="[10, 20, 50, 100]"
        :current-page="pagination.page"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pagination.size"
        :total="pagination.total"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
// 导入全局存储（新增）
import equipmentStore from '@/store/equipment'

export default {
  name: 'NewEquipmentList',
  data() {
    return {
      searchForm: {
        name: '',
        type: '',
        status: ''
      },
      // 从全局存储获取设备列表（修改）
      equipmentList: equipmentStore.equipmentList,
      pagination: {
        page: 1,
        size: 10,
        // 总数从全局列表获取（修改）
        total: equipmentStore.equipmentList.length
      }
    }
  },
  methods: {
    getTypeTagType(type) {
      const typeMap = {
        server: 'primary',
        switch: 'success',
        router: 'warning',
        firewall: 'danger',
        storage: 'info',
        other: 'default'
      }
      return typeMap[type] || 'default'
    },
    getStatusTagType(status) {
      const statusMap = {
        inUse: 'success',
        idle: 'warning',
        maintenance: 'danger'
      }
      return statusMap[status] || 'default'
    },
    handleSearch() {
      this.$message.info('搜索条件：' + JSON.stringify(this.searchForm))
    },
    handleReset() {
      this.searchForm = {
        name: '',
        type: '',
        status: ''
      }
    },
    handleCreate() {
      this.$router.push('/equipment/entry')
    },
    handleView(row) {
      this.$message.info('查看设备：' + row.name)
    },
    handleEdit(row) {
      this.$router.push({
        path: '/equipment/edit',
        query: { id: row.id }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 从全局列表中删除（修改）
        const index = equipmentStore.equipmentList.findIndex(item => item.id === row.id)
        if (index !== -1) {
          equipmentStore.equipmentList.splice(index, 1)
          this.equipmentList = equipmentStore.equipmentList
          this.pagination.total = this.equipmentList.length
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      this.pagination.size = val
    },
    handleCurrentChange(val) {
      this.pagination.page = val
    }
  }
}
</script>

<style scoped>
.equipment-list-container {
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

.search-form {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.edit-btn {
  color: #409eff;
}

.delete-btn {
  color: #f56c6c;
}

::v-deep .el-button--text {
  padding: 0 5px;
}

::v-deep .el-table-column {
  white-space: nowrap;
}
</style>
