// 消息提示工具（适配后端返回格式）
export const message = {
  success: function(text) {
    // 简单的弹窗提示，实际项目可替换为 Element UI 的 this.$message
    alert(`成功：${text}`)
  },
  error: function(text) {
    alert(`错误：${text}`)
  },
  info: function(text) {
    alert(`提示：${text}`)
  }
}
