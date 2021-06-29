<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!--卡片视图-->
      <el-card>
        <!--:gutter="20" el-col之间的距离-->
        <el-row :gutter="20">
          <!--:span="8" 总共24份，占8份-->
          <el-col :span="8">
            <!--clearable供一个X删除搜索关键字 -->
            <!--@clear="getUserList"重新获取所有的用户列表数据-->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!--用户列表区-->
            <!--:data="userlist" 用户数据源-->
        <el-table :data="userlist" border stripe>
          <!--type="index" 给这个属性直接是索引列的效果-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <!--作用域插槽-->
                <!--scope是自定义属性值名，其下有row的属性-->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="{}">
              <!-- 修改按钮 -->
              <!--size 大小属性-->
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <!-- 分配角色按钮 -->
              <!--:enterable="false" 鼠标不能进入tooltip=隐藏-->
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
            <!--:current-page 当前显示第几页的数据-->
            <!--:page-size 当前每页显示多少条数据-->
            <!--layout  要展示的功能组件-->
            <!--:total 总数据条数-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加用户的对话框 -->
            <!--:visible.sync对话框的显示与隐藏-->
            <!--close 关闭-->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 对话框主体区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
  export default {
    data() {
      // 验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
          // 合法的邮箱
          return cb()
        }

        cb(new Error('请输入合法的邮箱'))
      }

      // 验证手机号的规则
      var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if (regMobile.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法的手机号'))
      }

      return {
        // 获取用户列表的参数对象
        queryInfo: {
          // 查询参数
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 2
        },
        // 所有用户列表
        userlist: [],
        // 总数据条数
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '用户名的长度在6~15个字符之间', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            // 通过validator来连接验证规则
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const { data: res } = await this.$http.get('users', { params: this.queryInfo })
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
        this.userlist = res.data.users
        this.total = res.data.total
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 监听 switch 开关状态的改变
      async userStateChanged(userInfo) {
        // console.log(userInfo)
        // 发送请求进行状态修改
        const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`
        )
        // 如果返回状态为异常状态则报错并返回
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新用户状态失败！')
        }
        this.$message.success('更新状态成功')
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed() {
        // 对话框关闭之后，重置表达
        // 重置表单需要找到ref的引用对象，即addFormRef
        // resetFields对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        // console.log(this)
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮，添加新用户
      addUser() {
        // 调用validate进行表单验证
        // 欲校验表单需要找到ref的引用对象，即addFormRef
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) return this.$message.error('请填写完整用户信息')
          // 可以发起添加用户的网络请求
          const { data: res } = await this.$http.post('users', this.addForm)
          // 判断如果添加失败，就做提示
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！')
          }
          // 添加成功的提示
          this.$message.success('添加用户成功！')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表数据
          this.getUserList()
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
