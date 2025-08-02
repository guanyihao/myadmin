<template>
  <div class="register-container">
    <div class="content-wrapper">
      <!-- 左侧视频区域 -->
      <video class="bg-video" autoplay loop muted playsinline>
        <source :src="require('../../resource/1.mp4')" type="video/mp4">
      </video>
      <!-- 右侧注册框 -->
      <div class="register-card">
        <h2 class="register-title">用户注册</h2>
        <form class="register-form" @submit.prevent="handleSubmit">
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
  </div>
</template>

<script>
import accountApi from '@/api/account'
import { message } from '@/util/message'

const encryptPassword = (password) => {
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

    validateForm() {
      let isValid = true
      Object.keys(this.formErrors).forEach(field => {
        if (!this.validateField(field)) {
          isValid = false
        }
      })
      return isValid
    },

    async handleSubmit() {
      console.log('开始处理注册提交...')

      if (!this.validateForm()) {
        message.error('请修正表单中的错误后重试')
        console.log('表单验证失败，终止提交')
        return
      }

      try {
        this.isSubmitting = true
        const encryptedPassword = encryptPassword(this.form.password)
        const registerData = {
          username: this.form.username.trim(),
          email: this.form.email.trim(),
          password: encryptedPassword,
          phone: this.form.phone.trim(),
          birthday: this.form.birthday
        }

        console.log('即将发送到后端的注册数据：', registerData)
        const response = await accountApi.register(registerData)
        const result = response.data || {}
        console.log('后端返回的业务数据：', result)

        if (result.code === 20000) {
          message.success(result.message || '注册成功！正在跳转到登录页...')
          console.log('注册成功，执行跳转')
          this.$router.push('/login')
        } else {
          const errorMsg = result.message || '注册失败，请稍后重试'
          console.log('注册失败，原因：', errorMsg)
          message.error(errorMsg)
        }
      } catch (error) {
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
/* 深蓝色背景 */
.register-container {
  background-color: #0a2463;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

/* 内容容器 - 左右分栏并居中 */
.content-wrapper {
  display: flex;
  width: 100%;
  max-width: 1000px; /* 限制最大宽度，避免过宽 */
  height: 550px; /* 固定高度，保持视频和卡片尺寸一致 */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

/* 视频区域 - 占比45% */
.bg-video {
  width: 45%;
  height: 100%;
  object-fit: cover; /* 保持视频比例并填满区域 */
}

/* 注册卡片 - 占比55%，白色背景 */
.register-card {
  width: 55%;
  height: 100%;
  background: white;
  padding: 40px;
  box-sizing: border-box;
  overflow-y: auto;
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
  margin-top: 0;
  font-size: 24px;
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
  margin-top: 10px;
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

/* 响应式调整 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    height: auto;
  }
  .bg-video {
    width: 100%;
    height: 250px;
  }
  .register-card {
    width: 100%;
    height: auto;
  }
}
</style>
