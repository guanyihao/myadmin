<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">用户注册</h2>
      <form class="register-form" @submit.prevent="handleSubmit">
        <!-- 用户名 -->
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            :class="{ 'invalid': formErrors.username }"
            placeholder="请输入用户名"
            @blur="validateField('username')"
          >
          <span class="error-message">{{ formErrors.username }}</span>
        </div>

        <!-- 邮箱 -->
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :class="{ 'invalid': formErrors.email }"
            placeholder="请输入邮箱"
            @blur="validateField('email')"
          >
          <span class="error-message">{{ formErrors.email }}</span>
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            :class="{ 'invalid': formErrors.password }"
            placeholder="请输入密码（至少6位）"
            @blur="validateField('password')"
          >
          <span class="error-message">{{ formErrors.password }}</span>
        </div>

        <!-- 确认密码 -->
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            :class="{ 'invalid': formErrors.confirmPassword }"
            placeholder="请再次输入密码"
            @blur="validateField('confirmPassword')"
          >
          <span class="error-message">{{ formErrors.confirmPassword }}</span>
        </div>

        <!-- 手机号码 -->
        <div class="form-group">
          <label for="phone">手机号码</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="请输入11位手机号码"
            :class="{ 'invalid': formErrors.phone }"
            @blur="validateField('phone')"
          >
          <span class="error-message">{{ formErrors.phone }}</span>
        </div>

        <!-- 生日 -->
        <div class="form-group">
          <label for="birthday">生日</label>
          <input
            id="birthday"
            v-model="form.birthday"
            type="date"
            :class="{ 'invalid': formErrors.birthday }"
            @blur="validateField('birthday')"
          >
          <span class="error-message">{{ formErrors.birthday }}</span>
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">注册</span>
          <span v-if="isSubmitting">注册中...</span>
        </button>

        <div class="login-link">
          已有账号？<a href="/login">立即登录</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// 接口与工具导入
import accountApi from '@/api/account'
import { message } from '@/util/message'

// 密码加密处理函数（与后端保持一致）
const encryptPassword = (password) => {
  // 实际项目中需使用与后端相同的加密方式（如BCrypt）
  return password
}

export default {
  name: 'Register',

  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        birthday: ''
      },
      formErrors: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        birthday: ''
      },
      isSubmitting: false
    }
  },

  methods: {
    /**
     * 验证单个字段
     * @param {String} field 字段名
     * @returns {Boolean} 是否验证通过
     */
    validateField(field) {
      const value = this.form[field] || ''
      let error = ''

      switch (field) {
        case 'username':
          if (!value.trim()) {
            error = '用户名不能为空'
          } else if (value.length < 2 || value.length > 20) {
            error = '用户名长度必须在2-20之间'
          }
          break

        case 'email':
          if (!value.trim()) {
            error = '邮箱不能为空'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = '请输入有效的邮箱地址'
          }
          break

        case 'password':
          if (!value) {
            error = '密码不能为空'
          } else if (value.length < 6) {
            error = '密码长度不能少于6位'
          }
          break

        case 'confirmPassword':
          if (!value) {
            error = '请确认密码'
          } else if (value !== this.form.password) {
            error = '两次输入的密码不一致'
          }
          break

        case 'phone':
          if (!value) {
            error = '手机号码不能为空'
          } else if (!/^1[3-9]\d{9}$/.test(value)) {
            error = '请输入有效的11位手机号码'
          }
          break

        case 'birthday':
          if (!value) {
            error = '请选择生日'
          } else {
            const birthdayDate = new Date(value)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (birthdayDate > today) {
              error = '生日不能是未来时间'
            }
          }
          break
      }

      this.formErrors[field] = error
      return !error
    },

    /**
     * 验证所有字段
     * @returns {Boolean} 表单是否整体有效
     */
    validateForm() {
      let isValid = true
      Object.keys(this.formErrors).forEach(field => {
        if (!this.validateField(field)) {
          isValid = false
        }
      })
      return isValid
    },

    /**
     * 处理表单提交
     */
    async handleSubmit() {
      console.log('开始处理注册提交...')

      // 表单验证
      if (!this.validateForm()) {
        message.error('请修正表单中的错误后重试')
        console.log('表单验证失败，终止提交')
        return
      }

      try {
        this.isSubmitting = true
        // 密码加密
        const encryptedPassword = encryptPassword(this.form.password)
        // 构造提交数据（与后端User实体字段对应）
        const registerData = {
          username: this.form.username.trim(),
          email: this.form.email.trim(),
          password: encryptedPassword,
          phone: this.form.phone.trim(),
          birthday: this.form.birthday
        }

        console.log('即将发送到后端的注册数据：', registerData)

        // 调用注册接口
        console.log('开始调用注册接口...')
        const response = await accountApi.register(registerData)

        // 关键：从response.data提取后端返回的业务数据
        const result = response.data || {}
        console.log('后端返回的业务数据：', result)

        // 验证注册是否成功（根据后端code判断）
        if (result.code === 20000) {
          message.success(result.message || '注册成功！正在跳转到登录页...')
          console.log('注册成功，执行跳转')
          // 直接跳转登录页（去掉延迟避免问题）
          this.$router.push('/login')
        } else {
          // 显示后端返回的具体错误信息
          const errorMsg = result.message || '注册失败，请稍后重试'
          console.log('注册失败，原因：', errorMsg)
          message.error(errorMsg)
        }
      } catch (error) {
        // 捕获网络错误
        console.error('注册请求异常：', error)
        message.error('网络错误，请检查连接后重试')
      } finally {
        this.isSubmitting = false
        console.log('注册请求处理结束')
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
  margin-top: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.form-group input.invalid {
  border-color: #ff4d4f;
}

.error-message {
  display: block;
  margin-top: 5px;
  color: #ff4d4f;
  font-size: 12px;
  height: 16px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #359e75;
}

.submit-btn:disabled {
  background-color: #a0d9b9;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
